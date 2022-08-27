import * as readPkgUp from 'read-pkg-up';
const configPromise = readPkgUp.sync();


export async function testActionLib() {
    const conf = await configPromise;
    console.log(conf);
}
