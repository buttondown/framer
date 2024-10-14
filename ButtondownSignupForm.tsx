import React, { useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

export default function ButtondownForm(props) {
    const {
        newsletterConfiguration,
        text,
        style,
        textFieldFont,
        buttonFont,
        backgroundColor,
        submitButtonColors,
        margin,
        cornerRadius,
        borderColor,
        borderWidth,
        ...rest
    } = props

    const [email, setEmail] = useState("")
    const [isHovered, setIsHovered] = useState(false)
    const [formState, setFormState] = useState("idle") // idle, invalid, submitting, success

    // Styles

    const formStyle = {
        display: "flex",
        padding: `${margin.vertical}px ${margin.horizontal}px`,
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
    }

    const inputStyle = {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 0, // This allows the input to shrink below its content size
        padding: `${margin.vertical}px ${margin.horizontal}px`,
        color: "#4A5568",
        backgroundColor: "white",
        border: "none",
    }

    const buttonStyle = {
        padding: `${margin.vertical}px ${margin.horizontal}px`,
        color: "white",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        whiteSpace: "nowrap", // Prevents the button text from wrapping
        transition: "background-color 0.2s",
    }

    const srOnlyStyle = {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
    }

    useEffect(() => {
        if (formState === "success") {
            const timer = setTimeout(() => {
                setFormState("idle")
                setEmail("")
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [formState])

    const handleSubmit = (e) => {
        if (!isValidEmail(email)) {
            setFormState("invalid")
            setTimeout(() => setFormState("idle"), 500) // Reset after shake animation
            return
        }

        setFormState("submitting")

        if (newsletterConfiguration.onSubmit != "") {
            const customSubmit = new Function(
                "e",
                "email",
                newsletterConfiguration.onSubmit
            )
            customSubmit(e, email)
        }

        // Simulate successful submission after 2 seconds
        setTimeout(() => setFormState("success"), 2000)
    }

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email)
    }

    const getButtonContent = () => {
        return formState === "idle" ? (
            text.submitButton
        ) : (
            <AnimatedIcon state={formState} />
        )
    }

    const getButtonStyle = () => {
        let style = {
            ...buttonStyle,
            ...buttonFont,
            backgroundColor:
                formState === "success"
                    ? submitButtonColors.success
                    : isHovered
                      ? submitButtonColors.hover
                      : submitButtonColors.background,
            borderRadius: cornerRadius.button,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }
        if (formState === "invalid") {
            style.animation = "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
        }
        return style
    }

    return (
        <>
            <style>{`
                @media (max-width: 480px) {
                    .buttondown-form {
                        flex-wrap: wrap;
                    }
                    .buttondown-form input {
                        width: 100%;
                        margin-bottom: ${margin.verticalResponsive}px;
                    }
                    .buttondown-form button {
                        width: 100%;
                    }
                }

                @media (min-width: 481px) {
                    .buttondown-form button {
                        margin-left: ${margin.inline}px;
                    }
                }

                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes draw {
                    0% { stroke-dashoffset: 66; }
                    100% { stroke-dashoffset: 0; }
                }
            `}</style>
            <form
                className="buttondown-form"
                action={newsletterConfiguration.embedURL}
                method="post"
                target={
                    newsletterConfiguration.onSubmit &&
                    newsletterConfiguration.onSubmit.trim() !== ""
                        ? "popupwindow"
                        : undefined
                }
                onSubmit={handleSubmit}
                style={{
                    ...newsletterConfiguration,
                    ...formStyle,
                    ...style,
                    backgroundColor,
                    borderRadius: cornerRadius.form,
                    borderColor,
                    borderWidth,
                    borderStyle: borderWidth > 0 ? "solid" : "none",
                }}
            >
                <input
                    type="email"
                    name="email"
                    id="bd-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={text.placeholder}
                    style={{
                        ...inputStyle,
                        ...textFieldFont,
                        borderRadius: cornerRadius.input,
                    }}
                    required
                />
                <button
                    type="submit"
                    style={getButtonStyle()}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    disabled={formState === "submitting"}
                >
                    {getButtonContent()}
                </button>
                <label htmlFor="bd-email" style={srOnlyStyle}>
                    Enter your email
                </label>
            </form>
        </>
    )
}

// AnimatedIcon

const AnimatedIcon = ({ state }) => {
    const size = 24
    const strokeWidth = 2
    const center = size / 2
    const radius = center - strokeWidth
    const circumference = 2 * Math.PI * radius

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "1em", height: "1em" }}
        >
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeOpacity={0.2}
            />
            {state === "submitting" && (
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * 0.75}
                    style={{
                        transformOrigin: "center",
                        animation: "spin 1s linear infinite",
                    }}
                />
            )}
            {state === "success" && (
                <path
                    d={`M${size * 0.3125} ${size / 2} l${size * 0.125} ${
                        size * 0.125
                    } l${size * 0.25} -${size * 0.25}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={size}
                    strokeDashoffset={size}
                    style={{ animation: "draw 0.3s ease forwards" }}
                />
            )}
        </svg>
    )
}

// Props

ButtondownForm.defaultProps = {
    newsletterConfiguration: {
        embedURL:
            "https://buttondown.com/api/emails/embed-subscribe/your-newsletter-name-here",
        onSubmit: "",
    },
    textFieldFont: {
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: "Normal",
    },
    buttonFont: {
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: "Bold",
    },
    text: {
        placeholder: "newsletters@buttondown.email",
        submitButton: "Subscribe",
    },
    backgroundColor: "#EBF8FF",
    submitButtonColors: {
        background: "#4299E1",
        hover: "#3182CE",
        success: "#48BB78",
    },
    margin: {
        horizontal: 8,
        horizontalResponsive: 8,
        vertical: 8,
        verticalResponsive: 8,
        inline: 8,
        inlineResponsive: 4,
    },
    cornerRadius: {
        form: 16,
        input: 8,
        button: 8,
    },
    borderColor: "#E2E8F0",
    borderWidth: 0,
}

// Framer Configuration

addPropertyControls(ButtondownForm, {
    newsletterConfiguration: {
        type: ControlType.Object,
        title: "Newsletter",
        controls: {
            embedURL: {
                type: ControlType.String,
                title: "Embed URL",
            },
            onSubmit: {
                type: ControlType.String,
                title: "onSubmit",
                displayTextArea: true,
            },
        },
    },
    textFieldFont: {
        type: ControlType.Object,
        title: "Input Font",
        controls: {
            fontFamily: { type: ControlType.String, title: "Family" },
            fontSize: { type: ControlType.String, title: "Size" },
            fontWeight: {
                type: ControlType.Enum,
                title: "Weight",
                options: [
                    "Normal",
                    "Bold",
                    "100",
                    "200",
                    "300",
                    "400",
                    "500",
                    "600",
                    "700",
                    "800",
                    "900",
                ],
            },
        },
    },
    buttonFont: {
        type: ControlType.Object,
        title: "Button Font",
        controls: {
            fontFamily: { type: ControlType.String, title: "Family" },
            fontSize: { type: ControlType.String, title: "Size" },
            fontWeight: {
                type: ControlType.Enum,
                title: "Weight",
                options: [
                    "Normal",
                    "Bold",
                    "100",
                    "200",
                    "300",
                    "400",
                    "500",
                    "600",
                    "700",
                    "800",
                    "900",
                ],
            },
        },
    },
    backgroundColor: { type: ControlType.Color, title: "Background Color" },
    text: {
        type: ControlType.Object,
        title: "Text",
        controls: {
            placeholder: {
                type: ControlType.String,
                title: "Placeholder",
            },
            submitButton: {
                type: ControlType.String,
                title: "Button Text",
            },
        },
    },
    submitButtonColors: {
        type: ControlType.Object,
        title: "Submit Button",
        controls: {
            background: { type: ControlType.Color, title: "Button Color" },
            hover: { type: ControlType.Color, title: "Hover Color" },
            success: { type: ControlType.Color, title: "Success Color" },
        },
    },
    margin: {
        type: ControlType.Object,
        title: "Margin",
        controls: {
            horizontal: {
                type: ControlType.Number,
                title: "Horizontal",
                min: 0,
                max: 256,
                step: 1,
            },
            horizontalResponsive: {
                type: ControlType.Number,
                title: "(Mobile) Horizontal",
                min: 0,
                max: 256,
                step: 1,
            },
            vertical: {
                type: ControlType.Number,
                title: "Vertical",
                min: 0,
                max: 256,
                step: 1,
            },
            verticalResponsive: {
                type: ControlType.Number,
                title: "(Mobile) Vertical",
                min: 0,
                max: 256,
                step: 1,
            },
            inline: {
                type: ControlType.Number,
                title: "Inline",
                min: 0,
                max: 256,
                step: 1,
            },
            inlineResponsive: {
                type: ControlType.Number,
                title: "(Mobile) Inline",
                min: 0,
                max: 256,
                step: 1,
            },
        },
    },
    cornerRadius: {
        type: ControlType.Object,
        title: "Corner Radius",
        controls: {
            form: {
                type: ControlType.Number,
                title: "Background",
                min: 0,
                max: 256,
                step: 1,
            },
            input: {
                type: ControlType.Number,
                title: "Input",
                min: 0,
                max: 256,
                step: 1,
            },
            button: {
                type: ControlType.Number,
                title: "Button",
                min: 0,
                max: 256,
                step: 1,
            },
        },
    },
    borderColor: { type: ControlType.Color, title: "Border Color" },
    borderWidth: {
        type: ControlType.Number,
        title: "Border Width",
        min: 0,
        max: 10,
        step: 1,
    },
})
