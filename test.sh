#run all test
if [ "$1" = "all" ]; then
    ./node_modules/jest/bin/jest.js  --verbose  --env=@happy-dom/jest-environment
    exit
fi

#run test from one file
./node_modules/jest/bin/jest.js  --verbose ./src/pages/UsersPage.spec.js


#one test
#./node_modules/jest/bin/jest.js  --verbose -t 'change pagination page'   ./src/pages/UsersPage.spec.js



#./node_modules/jest/bin/jest.js  --verbose -t 'retrieveParamsFromUrl'   ./src/helpers/functions.spec.js
