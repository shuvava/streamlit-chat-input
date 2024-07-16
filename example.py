import streamlit as st
from chat_input_advanced import chat_input_avd


def on_arrow_key(key: str):
    st.info(f'key {key} pressed')


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run chat_input_advanced/example.py`

st.subheader("Custom chat input component")

# Create an instance of our component with a constant `name` arg, and
# print its output value.
val = chat_input_avd(on_arrow_key=on_arrow_key, at_bottom=False)
st.markdown(f'custom component sends value "{val}"')

if prompt := st.chat_input():
    st.markdown(f'standard component sends value "{prompt}"')
