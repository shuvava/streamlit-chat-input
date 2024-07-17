import os

import streamlit as st
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = True

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("chat_input_advanced"
        # does not fit this bill, so please choose something better for your
        # own component :)
        "chat_input_advanced",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("chat_input_advanced", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.
def chat_input_avd(placeholder: str = None, at_bottom: bool = True):
    """Create a new instance of "chat_input_advanced".

        :param placeholder: chat input placeholder
        :param at_bottom: if True put element at the bottom of the document
    """
    if placeholder is None:
        placeholder = 'Your message'
    new_value = _component_func(placeholder=placeholder, default={'value': ''})
    if at_bottom:
        st.markdown(f"""<style>
        iframe[title="chat_input_advanced.chat_input_advanced"] {{
            position: fixed;
            bottom: 8%;
            z-index: 99;
        }}
        div[data-testid="stAppViewBlockContainer"] {{
        max-height: 85%;
        overflow-y: auto;
        }}
        </style>
        """, unsafe_allow_html=True)
    value = new_value["value"]
    return value
