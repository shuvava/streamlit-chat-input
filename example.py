import numpy as np
import pandas as pd
import streamlit as st
from chat_input_advanced import chat_input_avd

if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant", "content": "How can I help you?"}]

for msg in st.session_state.messages:
    if 'content' in msg:
        st.chat_message(msg["role"]).write(msg["content"])
        df = pd.DataFrame(np.random.randn(50, 20), columns=("col %d" % i for i in range(20)))
        st.dataframe(df)  # Same as st.write(df)

#if prompt := st.chat_input():
if prompt := chat_input_avd():
    st.session_state.messages.append({"role": "assistant", "content": prompt})
    st.chat_message("assistant").write(prompt)
    df = pd.DataFrame(np.random.randn(50, 20), columns=("col %d" % i for i in range(20)))
    st.dataframe(df)  # Same as st.write(df)
