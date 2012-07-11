window.api_key = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
window.discoveryUrl = "http://api.wordnik.com/v4/resources.json"

describe 'SwaggerUi', ->
  
  describe 'constructor', ->
    
    beforeEach ->
      window.ui = new SwaggerUi
        api_key: window.api_key
        discoveryUrl: window.discoveryUrl
      waitsFor ->
        ui.ready
    
    it "sets a `ready` property when the API is ready", ->
      runs ->
        expect(ui.ready).toBe(true)
        
    it "has access to the precompiled Handlebars template", ->
      runs ->
        expect(Handlebars.templates['template.html']).toBeDefined() 
          
  describe 'DOM container', ->
    
    afterEach ->
      $("#swagger_ui").remove()
    
    it "renders to default DOM container if it exists", ->
      window.ui = new SwaggerUi
      waitsFor ->
        ui.ready          
      runs ->
        expect($("#swagger_ui").length).toBe(1)
    
    it "creates default DOM container if it doesn't exist", ->
      expect($("#swagger_ui").length).toBe(0)
      window.ui = new SwaggerUi
      waitsFor ->
        ui.ready
      runs ->
        expect($("#swagger_ui").length).toBe(1)
            
    it "allows an alternate DOM container to be specified when initialized", ->
      expect($("#swagger_ui").length).toBe(0)
      window.ui = new SwaggerUi
        dom_id: 'zhwagger'
      waitsFor ->
        ui.ready
      runs ->
        expect($("#zhwagger").length).toBe(1)