#run all test
if [ "$1" = "all" ]; then
    npm run test
    exit

else
    
    npm run test   -- -t   'save new menu - display error and clear msg after change menu name'
    npm run test   -- -t     'display good message and click add menu button'

    #npm run test ./src/App.spec.js  -- -t 'sign out'

    #npm run test ./src/pages/UserEditPage.spec.js #-- -t 'load client data'

    #npm run test ./src/pages/UsersPage.spec.js 

   # npm run test  ./src/pages/MenuPagesPage.spec.js 

    #npm run test    ./src/pages/LoginPage.spec.js -- -t "send good data to server" 

    #npm run test   ./src/helpers/functions.spec.js 

fi

