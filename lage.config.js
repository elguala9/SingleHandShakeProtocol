module.exports = {
  pipeline: {
    // Build task - rispetta le dipendenze tra pacchetti
    build: {
      // Dipendenze delle build
      deps: ["^build"],
      // Output da considerare per caching
      outputs: ["dist/**", "tsconfig.tsbuildinfo"]
    },
    
    // Test task - viene eseguito dopo build
    test: {
      deps: ["compile"],
      outputs: []
    },

    "postbuild": {
      deps: ["build"],
      outputs: [],
      run: {
        ".": "postbuild"  // runs `npm run postbuild` in root
      }
    },
        
    // Barrelsby task - nessuna dipendenza, può essere eseguito in parallelo
    barrelsby: {
      deps: [],
      outputs: ["src/index.ts"]
    },

    
    // Gen-exports task - richiede la build
    "gen-exports": {
      deps: ["barrelsby"],
      outputs: []
    },


    prepareTest: {
      command: "npm run prepareTest"
    },


    
    // Script combinati
    prepare: ["barrelsby", "build", "postbuild", "gen-exports"]

  },
  
  // Usa npm come client
  npmClient: "npm",
  
  // Opzioni di cache
  cacheOptions: {
    // Pattern dei file di output da considerare per caching
    outputGlob: ["dist/**", "lib/**"],
    // Dimensione massima della cache in MB
    cacheSizeInMB: 500
  },

  // Concurrency - numero di task in parallelo
  concurrency: 4,

  // Ignora i cambiamenti in questi file per la detection delle modifiche
  ignore: ["*.md", "**/*.md", "**/*.test.ts", "**/*.spec.ts"]
};