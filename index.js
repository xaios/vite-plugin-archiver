const fs = require('node:fs')
const path = require('node:path')
const child_process = require('node:child_process')

const archiver = require('archiver')
archiver.registerFormat('zip-encrypted', require('archiver-zip-encrypted'))

function Num(num) {
  return `${100 + num}`.slice(1)
}

function GetTime(format) {
  if (!format) return ''

  let t = new Date
  return format.replace(/yyyy/g, t.getFullYear()).replace(/MM/g, Num(t.getMonth() + 1)).replace(/dd/g, Num(t.getDate())).replace(/hh/g, Num(t.getHours())).replace(/mm/g, Num(t.getMinutes())).replace(/ss/g, Num(t.getSeconds()))
}

function CreateArchiver(mode, option, password) {
  password = typeof password == 'string' && password ? password : ''
  password && console.log(`\nthe ${mode} password is\n${password}`)

  let archive = password ? archiver('zip-encrypted', { zlib: { level: 9 }, encryptionMethod: 'aes256', password }) : archiver('zip', { zlib: { level: 9 } })
  archive.pipe(fs.createWriteStream([mode, option.name, GetTime(option.format)].filter(i => i).join('_') + '.zip'))

  return archive
}

module.exports = function(option = {}) {
  let name = typeof option == 'string' ? option : option.name
  option = Object.assign({ name, dist: 'dist', open: true, origin: true, format: 'MMddhhmm', ignore_file: ['*.zip'], ignore_folder: [] }, option)

  async function closeBundle() {
    const archiver_result = CreateArchiver(option.result_pre || 'result', option, option.password)
    archiver_result.directory(option.dist, false)
    archiver_result.finalize()

    if (option.origin) {
      const archiver_origin = CreateArchiver(option.origin_pre || 'origin', option, option.origin)

      archiver_origin.glob('*', {
        matchBase: true,
        ignore: option.ignore_file,
        skip: ['.git', 'node_modules', option.dist].concat(option.ignore_folder)
      })
      archiver_origin.finalize()
    }

    option.open && process.platform == 'win32' && child_process.exec('explorer .')
  }

  return { name: 'archiver', apply: 'build', closeBundle }
}
