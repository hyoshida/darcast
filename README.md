# darcast

yukkuri on web browser.

## Requirements

* Node.js 0.11
* MongoDB 2.2
* [yukkurid](https://github.com/masarakki/yukkurid)
  * ALSA (aplay command)
  * mecab
  * Ruby
  * AquesTalk2.so

## Usage

1. Install libraries

  ```bash
  npm install
  bower install # (or `node_modules/.bin/bower install`)
  ```

2. Install yukkurid

  ```bash
  git submodule update --init
  bundle install
  bundle exec rake unidic:install
  ```

3. Run a server

  ```bash
  npm start
  ```

4. Plese open `http://127.0.0.1:8000/` in your browser.
