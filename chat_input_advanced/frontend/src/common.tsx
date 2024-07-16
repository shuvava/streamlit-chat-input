import { getLuminance } from "color2k"
import styled from "@emotion/styled"
import { StreamlitComponentBase, Theme } from "streamlit-component-lib"
import React, { createRef, ReactNode } from "react"
import "./style.css"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"

export const colors = {
  transparent: "transparent",
  current: "currentColor",
  inherit: "inherit",
  black: "#000000",
  white: "#ffffff",

  gray10: "#fafafa",
  gray20: "#f0f2f6",
  gray30: "#e6eaf1",
  gray40: "#d5dae5",
  gray50: "#bfc5d3",
  gray60: "#a3a8b8",
  gray70: "#808495",
  gray80: "#555867",
  gray85: "#31333F",
  gray90: "#262730",
  gray100: "#0e1117",

  red10: "#fff0f0",
  red20: "#ffdede",
  red30: "#ffc7c7",
  red40: "#ffabab",
  red50: "#ff8c8c",
  red60: "#ff6c6c",
  red70: "#ff4b4b",
  red80: "#ff2b2b",
  red90: "#bd4043",
  red100: "#7d353b",

  orange10: "#fffae8",
  orange20: "#fff6d0",
  orange30: "#ffecb0",
  orange40: "#ffe08e",
  orange50: "#ffd16a",
  orange60: "#ffbd45",
  orange70: "#ffa421",
  orange80: "#ff8700",
  orange90: "#ed6f13",
  orange100: "#d95a00",

  yellow10: "#ffffe1",
  yellow20: "#ffffc2",
  yellow30: "#ffffa0",
  yellow40: "#ffff7d",
  yellow50: "#ffff59",
  yellow60: "#fff835",
  yellow70: "#ffe312",
  yellow80: "#faca2b",
  yellow90: "#edbb16",
  yellow100: "#dea816",
  yellow110: "#916e10",

  green10: "#dffde9",
  green20: "#c0fcd3",
  green30: "#9ef6bb",
  green40: "#7defa1",
  green50: "#5ce488",
  green60: "#3dd56d",
  green70: "#21c354",
  green80: "#09ab3b",
  green90: "#158237",
  green100: "#177233",

  blueGreen10: "#dcfffb",
  blueGreen20: "#bafff7",
  blueGreen30: "#93ffee",
  blueGreen40: "#6bfde3",
  blueGreen50: "#45f4d5",
  blueGreen60: "#20e7c5",
  blueGreen70: "#00d4b1",
  blueGreen80: "#29b09d",
  blueGreen90: "#2c867c",
  blueGreen100: "#246e69",

  lightBlue10: "#e0feff",
  lightBlue20: "#bffdff",
  lightBlue30: "#9af8ff",
  lightBlue40: "#73efff",
  lightBlue50: "#4be4ff",
  lightBlue60: "#24d4ff",
  lightBlue70: "#00c0f2",
  lightBlue80: "#00a4d4",
  lightBlue90: "#0d8cb5",
  lightBlue100: "#15799e",

  blue10: "#e4f5ff",
  blue20: "#c7ebff",
  blue30: "#a6dcff",
  blue40: "#83c9ff",
  blue50: "#60b4ff",
  blue60: "#3d9df3",
  blue70: "#1c83e1",
  blue80: "#0068c9",
  blue90: "#0054a3",
  blue100: "#004280",

  purple10: "#f5ebff",
  purple20: "#ebd6ff",
  purple30: "#dbbbff",
  purple40: "#c89dff",
  purple50: "#b27eff",
  purple60: "#9a5dff",
  purple70: "#803df5",
  purple80: "#6d3fc0",
  purple90: "#583f84",
  purple100: "#3f3163",
}
const defaultRadius = "0.5rem"

export function hasLightBackgroundColor(theme?: Theme): boolean {
  return getLuminance(theme?.backgroundColor as string) > 0.5
}

export interface StyledChatInputContainerProps extends ComponentProps {
  className: string
}

export class StyledChatInputContainer extends React.PureComponent<StyledChatInputContainerProps> {
  public render = (): ReactNode => {
    const { theme, width, children, className } = this.props
    const lightTheme = hasLightBackgroundColor(theme)
    const style: React.CSSProperties = {
      display: "flex",
      width: `${width}px`,
      borderRadius: defaultRadius,
    }

    if (theme) {
      // TODO: maybe it should be different one
      style.backgroundColor = lightTheme ? theme.secondaryBackgroundColor : colors.gray80
    }
    return (
      <div
        style={style} className={className}>
        {children}
      </div>
    )
  }
}

export class StyledChatInput extends StreamlitComponentBase {
  public render = (): ReactNode => {
    const { children } = this.props
    const style: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      position: "relative",
      flexGrow: 1,
      backgroundColor: "transparent",
      borderRadius: defaultRadius,
    }


    return (
      <div
        style={style}>
        {children}
      </div>
    )
  }
}

interface StyledSendIconButtonState {
  hover: boolean
}

interface ButtonProps extends ComponentProps {
  onClick ():void
}

export class StyledSendIconButton extends React.PureComponent<ButtonProps, StyledSendIconButtonState> {
  public state: StyledSendIconButtonState = {
    hover: false,
  }
  private buttonRef: React.RefObject<HTMLButtonElement>
  
  constructor(props: ButtonProps | Readonly<ButtonProps>) {
    super(props)
    //props.
    this.buttonRef = createRef<HTMLButtonElement>()
  }

  private toggleHover = () => {
    this.setState({hover: !this.state.hover})
  }
  public render = (): ReactNode => {
    const { theme, disabled, children } = this.props
    const lightTheme = hasLightBackgroundColor(theme)
    const [cleanIconColor, dirtyIconColor] = lightTheme
      ? [colors.gray60, colors.gray80]
      : [colors.gray40, colors.gray10]
    const style = this.buttonRef.current?.style
    style?.setProperty('--text-color', disabled ? cleanIconColor : dirtyIconColor)
    style?.setProperty('--focus-background-color',lightTheme ? colors.gray10 : colors.gray60)
    style?.setProperty('--hover-background-color',colors.red60)
    style?.setProperty('--hover-color', colors.gray10)
    style?.setProperty('--disabled-color', colors.gray50)
    return (
      <button
        ref={this.buttonRef}
        data-testid="stChatInputSubmitButton"
        className="chat-input"
        disabled={disabled}
        onClick={this.props.onClick}
        onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}
      >
        {children}
      </button>
    )
  }
}

export const StyledSendIconButtonContainer = styled.div({
  display: "flex",
  alignItems: "flex-end",
  height: "100%",
  position: "absolute",
  right: "0px",
  pointerEvents: "none",
})

