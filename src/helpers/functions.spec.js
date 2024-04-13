import functions from "./functions.js";
import storage from "../state/storage";

import jsonStoreModule from "../../test/jsonStore.js"
const jsonStore = jsonStoreModule.getJsonStore()


describe("functions", () => {

    const errStrOrJsonTest1 = { "title.pl": [ "The title.pl field is required." ], "short_title.pl": [ "The short title.pl field is required." ], "title.en": [ "The title.en field is required." ], "short_title.en": [ "The short title.en field is required." ] };  

    describe("parseError", () => {
      it( 'parseError return str', async ()  => {
        const input = 'aaaaaaa';
        const out =  await functions.parseError( input );
        expect(out ).toEqual( {'err' : [input]} );
      });

      it( 'parseError input obj', async ()  => {
        const out =  await functions.parseError( errStrOrJsonTest1 );
        expect(out).toBe(errStrOrJsonTest1);
      });      
    });

    describe("getErrorFields", () => {
      it( 'getErrorFields test1', async ()  => {
        const out = await functions.getErrorFields( errStrOrJsonTest1 );

        expect(out).toEqual( [ 'title', 'short_title' ] );
      });      
    });

    describe("isNotEmptyObj", () => {
      it( 'isNotEmptyObj out true', async ()  => {
        const keys = [ 'en', 'pl' ];

        const obj = {
          'pl': 'a',
          'en' :'b'
        };

        const out = functions.isNotEmptyObj( obj, keys );
        expect(out).toBe( true );
      });      

      it( 'isNotEmptyObj out false', async ()  => {
        const keys = [ 'en', 'pl' ];

        const obj = {
          'pl': 'a',
          'en' :''
        };

        const out = functions.isNotEmptyObj( obj, keys );
        expect(out).toBe( false );
      });      

      it( 'isNotEmptyObj empty in out false', async ()  => {
        const keys = [ 'en', 'pl' ];
                
        const obj = {
        };

        const out = functions.isNotEmptyObj( obj, keys );
        expect(out).toBe( false );
      });      


      it( 'isNotEmptyObj out false with keys', async ()  => {
        const keys = [ 'en', 'pl' ];

        const obj = {
          'pl': 'a',
        };

        const out = functions.isNotEmptyObj( obj, keys );
        expect(out).toBe( false );
      });      


    });

    describe("createEmptyObj", () => {

      it( 'createEmptyObj with two langs', async ()  => {
        const langs = [ 'en', 'pl' ];

        const outExpect = {
          'en': '',
          'pl': '',        
        };

        const out = functions.createEmptyObj( langs );
        expect(out).toEqual( outExpect );        
      });          

    });              


});

describe("retrieveParamsFromStorage", () => {
   
  beforeEach(() => {
    storage.setItem("auth", jsonStore.auth);
    storage.setItem("config", jsonStore.config);
  })

  it( 'get all params', async ()  => {
    const { configLangs, configDefaultLang, pageTypes, cacheEnable, token } = functions.retrieveParamsFromStorage();        

    expect(configLangs).toEqual(jsonStore.config.langs);
    expect(configDefaultLang).toBe(jsonStore.config.default_lang );
    expect(pageTypes).toEqual(jsonStore.config.page_types );    
    expect(cacheEnable).toEqual(jsonStore.config.cache_enable );        

    expect(token).toBe(jsonStore.auth.token );

  });          

  it( 'get one param', async ()  => {
    const { token } = functions.retrieveParamsFromStorage();        
    expect(token).toBe(jsonStore.auth.token );
  });          


});


describe("retrieveParamsFromUrl", () => {
   
  it( 'get page param from url', async ()  => {
    const url = "http://127.0.0.1:8000/api/clients/id/desc?page=1";
    const page = functions.retrieveParamsFromUrl( url, 'page');
    expect(page).toBe("1");
  });          

});
