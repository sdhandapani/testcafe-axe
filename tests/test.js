import { testcafeAudit } from 'testcafe-lighthouse';

const fs = require("fs");
const parser = require("papaparse")

const csvFile = fs.readFileSync("./data/urllist.csv", { encoding: "utf8" });
const urlData = parser.parse(csvFile, { header: true });


fixture(`Audit Test`).page('https://agl.com.au');
 
urlData.data.forEach(url => {
  test(`url with email ${url.urlpath}`, async t => {
    await t
    console.log(url.urlpath)
  });
});


urlData.data.forEach(url => {
test.page(url.urlpath)('url audits webpage with specific thresholds', async (t) => {
  const currentURL = await t.eval(() => document.documentURI);
  const reportDirectory = `${process.cwd()}/lighthouse`;
  
  console.log('url:', currentURL);

  await testcafeAudit({
    url: currentURL,
    thresholds: {
      performance: 30,
      accessibility: 50,
      'best-practices': 50,
      seo: 50,
    },
    cdpPort: 6007,
    htmlReport: true,
    reports: {
      formats: {
        /* you can any of them or combination of them */
        json: false, //defaults to false
        html: true, //defaults to false
        csv: false, //defaults to false
       },
      name: url.pagename, //defaults to `lighthouse-${new Date().getTime()}`
      directory: `reportDirectory`, //defaults to `${process.cwd()}/lighthouse`
     },
    });
  });

});

urlData.data.forEach(url => {
test.page(url.urlpath)('homepage scores mobile', async (t) => {
  const currentURL = await t.eval(() => document.documentURI);
  const lighthouseOptions = {
    emulatedFormFactor: 'mobile',
  };
  console.log('url:', currentURL);
  
  await testcafeAudit({
    url: currentURL,
    opts: lighthouseOptions,
    thresholds: {
      performance: 30,
      accessibility: 30,
      'best-practices': 30,
      seo: 30,
      pwa: 30,
    },
    cdpPort: 6007,
    htmlReport: true,
    reports: {
      formats: {
        json: false,
        html: true,
        csv: false,
      },
      name: url.pagename+'-mobile',
      directory: 'reportDirectory',
      },
    });
  });

});