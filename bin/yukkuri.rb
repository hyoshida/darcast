#!/usr/bin/env ruby
$:.push('yukkurid/lib')

require 'yukkuri'

# escape command injection
text = STDIN.read.delete('"')

# 1. 先頭が大文字だと名詞判定されるので、小文字に変換
# 2. ４文字より長い文字列だと未知語判定されるので、ローマ字読みしてもらえるように４文字区切りの英字に変換
readable_text = text.downcase.gsub(/([a-z]{4})/, '\1 ')

aqtalk = Yukkuri::Message.new(readable_text).aqtalk.tr('!?', ' ？')
print `echo "#{aqtalk}" | yukkurid/bin/yukkuri`
