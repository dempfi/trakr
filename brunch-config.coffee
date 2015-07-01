exports.config =
  # See http://brunch.io/#documentation for docs.
  plugins :
    autoReload :
      enabled : true
    stylus :
      imports : ['nib']

  files:
    javascripts:
      joinTo:
        'app.js' : /^app/
        'vendor.js': /^(bower_components|vendor\/js)/
    stylesheets:
      joinTo: 'app.css'
    templates:
      joinTo: 'app.js'
  paths:
    public: 'osx_container/public'
