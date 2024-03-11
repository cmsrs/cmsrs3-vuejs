import functions from "./functions.js";


describe("functions", () => {

    const errStrOrJsonTest1 = { "title.pl": [ "The title.pl field is required." ], "short_title.pl": [ "The short title.pl field is required." ], "title.en": [ "The title.en field is required." ], "short_title.en": [ "The short title.en field is required." ] };  

    describe("parseError", () => {
      it( 'parseError return str', async ()  => {
        const input = 'aaaaaaa';
        const out =  await functions.parseError( input );
        expect(out ).toBe(input);
      });

      it( 'parseError return obj', async ()  => {
        const out =  await functions.parseError( errStrOrJsonTest1 );
        expect(out).toBe("The title.pl field is required.");
      });      
    });

    describe("getErrorFields", () => {
      it( 'getErrorFields test1', async ()  => {
        const out = await functions.getErrorFields( errStrOrJsonTest1 );

        expect(out).toEqual( [ 'title', 'short_title' ] );
      });      
    });

});  