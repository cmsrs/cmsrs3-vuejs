import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

afterEach(() => {
    localStorage.clear()
})  
