import { Textarea as UITextArea } from "baseui/textarea"
import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ChangeEvent, ReactNode, KeyboardEvent, createRef } from "react"
import {
  colors,
  hasLightBackgroundColor,
  StyledChatInput,
  StyledChatInputContainer, StyledSendIconButton,
  StyledSendIconButtonContainer,
} from "./common"
import { Provider as StyletronProvider } from "styletron-react"
import { BaseProvider, LightTheme, DarkTheme } from "baseui"
import { Client as Styletron } from "styletron-engine-monolithic"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"
import { IoSend } from "react-icons/io5";

interface State {
  isFocused: boolean
  value: string
  dirty: boolean
  scrollHeight: number
  minHeight: number,
  maxHeight: number
}

interface PublicState {
  value: string
  arrowKey?: string
}

const engine = new Styletron()

const isEnterKeyPressed = (event: KeyboardEvent<HTMLTextAreaElement>): boolean => {
  // Using keyCode as well due to some different behaviors on Windows
  // https://bugs.chromium.org/p/chromium/issues/detail?id=79407

  const { keyCode, key } = event
  return (
    (key === "Enter" || keyCode === 13 || keyCode === 10) &&
    // Do not send the sentence being composed when Enter is typed into the IME.
    !(event.nativeEvent?.isComposing === true)
  )
}

const isArrowKeyPressed = (event: KeyboardEvent<HTMLTextAreaElement>): boolean => {
  const { key } = event
  return key === "ArrowUp" || key === "ArrowDown"
}


// Rounding errors can arbitrarily create scrollbars. We add a rounding offset
// to manage it better.
const ROUNDING_OFFSET = 1


/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class ChatInputAdvanced extends StreamlitComponentBase<State> {
  public state: State = {
    isFocused: false,
    dirty: false,
    value: "",
    scrollHeight: 0,
    minHeight: 0,
    maxHeight: 140,
  }
  private readonly chatInputRef: React.MutableRefObject<HTMLTextAreaElement>

  constructor(props: ComponentProps<any> | Readonly<ComponentProps<any>>) {
    super(props)
    // @ts-ignore
    this.chatInputRef = createRef<HTMLTextAreaElement>()
  }

  private getScrollHeight = (): number => {
    let scrollHeight = 0
    const { current: textarea } = this.chatInputRef
    if (textarea) {
      const placeholder = textarea.placeholder
      textarea.placeholder = ""
      textarea.style.height = "auto"
      scrollHeight = textarea.scrollHeight
      textarea.placeholder = placeholder
      textarea.style.height = ""
    }

    return scrollHeight
  }

  private setScrollHeight(h: number) {
    this.setState({ scrollHeight: h })
  }

  public render = (): ReactNode => {
    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`.
    const placeholder = this.props.args["placeholder"]
    const maxHeightArg = this.props.args["maxHeight"]
    if (maxHeightArg) {
      this.setState(
        _ => ({ maxHeight: maxHeightArg }),
      )
    }

    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    const { theme, width, disabled } = this.props;

    const lightTheme = hasLightBackgroundColor(theme);
    const rootTheme = lightTheme ? LightTheme : DarkTheme;
    rootTheme.colors.borderSelected  = colors.red60;
    const placeholderColor = lightTheme
      ? colors.gray60
      : colors.gray70;

    // @ts-ignore
    const isInputExtended =
      this.state.scrollHeight > 0 && this.chatInputRef.current
        ? Math.abs(this.state.scrollHeight - this.state.minHeight) > ROUNDING_OFFSET
        : false;

    return (
      <>
        <StyletronProvider value={engine}>
          <BaseProvider theme={rootTheme}>
            <StyledChatInputContainer
              className="stChatInput"
              data-testid="stChatInput"
              theme={theme}
              width={width}
              args={null}
              disabled={disabled}
            >
              <StyledChatInput
                width={width}
                args={null} disabled={disabled}
              >
                <UITextArea
                  inputRef={this.chatInputRef}
                  value={this.state.value}
                  placeholder={placeholder}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  aria-label={placeholder}
                  disabled={disabled}
                  rows={1}
                  clearOnEscape
                  overrides={{
                    Root: {
                      style: {
                        minHeight: "1px",
                        outline: "none",
                        backgroundColor: colors.transparent,
                        // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
                        borderLeftWidth: "1px",
                        borderRightWidth: "1px",
                        borderTopWidth: "1px",
                        borderBottomWidth: "1px",
                        width: `${width}px`,
                      },
                    },
                    InputContainer: {
                      style: {
                        backgroundColor: colors.transparent,
                      },
                    },
                    Input: {
                      props: {
                        "data-testid": "stChatInputTextArea",
                      },
                      style: {
                        lineHeight: 1,
                        backgroundColor: colors.transparent,
                        "::placeholder": {
                          color: placeholderColor,
                        },
                        height: isInputExtended
                          ? `${this.state.scrollHeight + ROUNDING_OFFSET}px`
                          : "auto",
                        maxHeight: this.state.maxHeight ? `${this.state.maxHeight}px` : "none",
                        // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
                        paddingRight: "3rem",
                        paddingLeft: "0.5rem",
                        paddingBottom: "0.5rem",
                        paddingTop: "0.5rem",
                      },
                    },
                  }}
                ></UITextArea>
                <StyledSendIconButtonContainer>
                  <StyledSendIconButton
                    onClick={()=>this.handleSubmit('')}
                    disabled={!this.state.dirty || disabled}
                    data-testid="stChatInputSubmitButton"
                    args={null} width={0} theme={theme}>
                    <IoSend size="18" color="inherit" />
                  </StyledSendIconButton>
                </StyledSendIconButtonContainer>
              </StyledChatInput>
            </StyledChatInputContainer>
          </BaseProvider>
        </StyletronProvider>
      </>
    )
  }


  public handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    try {
      const { value: newText } = e.target
      this.setState({ value: newText, dirty: newText !== "" })
      this.setScrollHeight(this.getScrollHeight())
    } catch (e) {
      this.onError(e)
    }
  }

  private handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    const { metaKey, ctrlKey, shiftKey } = e
    let shouldSubmit =
      isEnterKeyPressed(e) && !shiftKey && !ctrlKey && !metaKey
    let arrowKey = undefined
    const { key } = e
    if (isArrowKeyPressed(e)) {
      arrowKey = key
      shouldSubmit = true
    }
    if (key === 'Escape') {
      this.setState({value: ''})
    }
    if (shouldSubmit) {
      e.preventDefault()

      this.handleSubmit(arrowKey)
    }
  }

  private handleSubmit = (arrowKey?: string): void => {
    // We want the chat input to always be in focus
    // even if the user clicks the submit button
    // if (chatInputRef.current) {
    //   chatInputRef.current.focus()
    // }
    if (this.state.value === "" && !arrowKey) {
      return
    }
    const compState: PublicState = {
      value: this.state.value,
    }
    if (arrowKey !== "") {
      compState.arrowKey = arrowKey
    }
    this.setState(
      _ => ({ value: "", dirty: false }),
      () => Streamlit.setComponentValue(compState),
    )
    this.setScrollHeight(0)
  }


  private onError = (e: any): void => {
    console.log(`some error happen: ${e}`)
  }
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(ChatInputAdvanced)
