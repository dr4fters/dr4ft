let d = React.DOM

export let STRINGS = {
  BRANDING: {
    SITE_NAME: ['dr4ft'],
    DEFAULT_USERNAME: 'dr4fter',
  },

  PAGE_SECTIONS: {
    MOTD:       d.ul({},
        d.li({},
          d.div({},
            'Beta test new features @ ',
            d.a({ href: 'http://beta.dr4ft.com'}, 'beta.dr4ft.com!')
          )
        ),
        d.li({},
          d.div({},
            'Bug Reports? Feature Requests? ',
            d.a({ href: 'https://docs.google.com/forms/d/1l57Xcb_JH0TN-LgekiFgwM3845P4Lb5dvUc9-bI9ws8/viewform' },
              'Fill out this survey'),
            ' or ',
            d.a({ href: 'https://github.com/arxanas/drafts.ninja/issues' },
              'file a Github issue')
          )
        )
      ),  // message of the day; can be a React element


    FOOTER: d.div({},
      d.strong({}, 'dr4ft'),
      ' is a fork of the ',
      d.code({}, 'drafts.ninja'),
      ' arxanas fork of the ',
      d.code({}, 'draft'),
      ' project by aeosynth. Contributions welcome! ',
      d.a({ href: 'https://github.com/tritoch/dr4ft' },
        'https://github.com/tritoch/dr4ft')),
  },
}
