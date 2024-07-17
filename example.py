import streamlit as st
from chat_input_advanced import chat_input_avd

if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant", "content": "How can I help you?"}]

for msg in st.session_state.messages:
    if 'content' in msg:
        st.chat_message(msg["role"]).write(msg["content"])

#if prompt := st.chat_input():
if prompt := chat_input_avd():
    st.session_state.messages.append({"role": "assistant", "content": prompt})
    st.chat_message("assistant").write(prompt)
