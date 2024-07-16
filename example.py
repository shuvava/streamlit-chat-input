import streamlit as st
from chat_input_advanced import chat_input_avd


def on_arrow_key(key: str):
    st.info(f'key {key} pressed')


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run chat_input_advanced/example.py`

st.subheader("Component with constant args")

# Create an instance of our component with a constant `name` arg, and
# print its output value.
val = chat_input_avd("World", on_arrow_key=on_arrow_key)
st.markdown(f'received value "{val}"')

if prompt := st.chat_input():
    print(prompt)

# st.markdown("---")
# st.subheader("Component with variable args")

# # Create a second instance of our component whose `name` arg will vary
# # based on a text_input widget.
# #
# # We use the special "key" argument to assign a fixed identity to this
# # component instance. By default, when a component's arguments change,
# # it is considered a new instance and will be re-mounted on the frontend
# # and lose its current state. In this case, we want to vary the component's
# # "name" argument without having it get recreated.
# name_input = st.text_input("Enter a name", value="Streamlit")
# num_clicks = chat_input_advanced(name_input, key="foo")
# st.markdown("You've clicked %s times!" % int(num_clicks))
