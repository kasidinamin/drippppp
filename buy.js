const readlineSync = require("readline-sync");
const fs = require("fs");
const delay = require("delay");
var fetch = require("node-fetch");
var chalk = require("chalk");
const { table } = require('table');
const Axios = require('axios')
const path = require('path');
var random = require('random-name');
const puppeteer = require("puppeteer");
const cluster = require("cluster");
var arguments = require("minimist")(process.argv.slice(1));

// node run --thread=2 --urlShop=https://jkt48.com/handshake/form/hid/379/pid/398?lang=id --value=box_15612 --total=1 //

if (cluster.isMaster) {
    console.log(chalk.white('[') + chalk.green('!') + chalk.white(']') + ` Auto Order Ticket JKT 48`)
    console.log()

    for (let i = 0; i < arguments["thread"]; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    (async () => {
        const $options = {
            waitUntil: "networkidle2",
        };
        var browser = await puppeteer.launch(
        { 
            headless: false
        }
        );
        const page = await browser.newPage();
        
        await page.goto('https://jkt48.com/login?lang=id');
        
        const email = await page.$('#login_id');
        await email.type('inzhagi235@gmail.com');
        
        const password = await page.$('#login_password');
        await password.type('Winter66');
        
        const submit = await page.$('button[type="submit"]')
        await submit.click()
        
        await page.waitForNavigation($options)
        if (page.url().includes('mypage')) {
            console.log(chalk.white('[') + chalk.green(`!`) + chalk.white(']') + ` Information  => ` + chalk.yellow(`Waiting For Buying Tickets`))
        
            var url = arguments["urlShop"];

            await page.goto(''+url+'')

            var value = arguments["value"];
            var total = arguments["total"];
        
            // var pilihan = readlineSync.question("[+] Ticket Total    : ");
        
            await page.select(`select#${value}`, `${total}`)
            
            const submit = await page.$('button[type="submit"]')
            await submit.click()
            
            await page.waitForSelector('label[for="agree"]')
            const checkbox = await page.$('label[for="agree"]')
            await checkbox.click()
        
            const lastSubmit = await page.$('button[type="submit"]')
            await lastSubmit.click()
        
            try {
                await page.waitForSelector('body > div.container > div.row > div.col-lg-9.order-1.order-lg-2.entry-contents__main-area > div > div > div.form-group.row.row-all-15 > div.col-12.mt-4 > p', {visible:true, timeout:5000})
                var info = await page.evaluate(() => {
                    return document.querySelector('body > div.container > div.row > div.col-lg-9.order-1.order-lg-2.entry-contents__main-area > div > div > div.form-group.row.row-all-15 > div.col-12.mt-4 > p').innerText;
                })
                
                console.log(info)
            } catch(err) {
        
            }

            await page.waitForSelector('#btn_exec');
            var buy = await page.$('#btn_exec')
            await buy.click()
            await delay(99999)
        }
    })();
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}