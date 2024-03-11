import trans from "./trans.js";


describe("trans", () => {
    describe("getStrByKey", () => {
      it( 'getStrByKey get test str', async ()  => {
        const t1 = trans.ttt( 'success_page_edit' );
        expect( t1 ).not.toBe( '' );
      });
      it( 'getStrByKey get empty', async ()  => {
        const t1 = trans.ttt( 'success_page_edit_23434' );
        expect( t1 ).toBe( '' );
      });

    });

});  