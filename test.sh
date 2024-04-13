#run all test
if [ "$1" = "all" ]; then
    npm run test
    exit

else

    #npm run test ./src/pages/UserEditPage.spec.js -- -t 'load client data'

    #npm run test ./src/pages/UsersPage.spec.js 

    #npm run test  ./src/pages/MenuPagesPage.spec.js 

    #npm run test    ./src/pages/LoginPage.spec.js 

    npm run test   ./src/helpers/functions.spec.js 

fi

