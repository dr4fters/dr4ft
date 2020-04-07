import React from "react";

export const STRINGS = {
  BRANDING: {
    SITE_TITLE: ["dr4ft", "info"].join("."),
    SITE_NAME: <span>DR<img src='4.png' alt='4'/>FT</span>,
    DEFAULT_USERNAME: "dr4fter",
    PAYPAL: "",
  },

  PAGE_SECTIONS: {
    MOTD: null, // TODO: handle overwrite of this message of the day; can be a React element

    FOOTER:
      <div>
        <strong>dr4ft</strong> is a fork of
        the <code>drafts.ninja</code> arxanas fork of
        the <code >draft</code> project by aeosynth.
        Contributions welcome! &nbsp;
        <a href='https://github.com/dr4fters/dr4ft'>
          <img src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' alt='GitHub' title='GitHub Repository' align='top' height='18' />
        dr4fters/dr4ft</a>
      </div>
  }
};
