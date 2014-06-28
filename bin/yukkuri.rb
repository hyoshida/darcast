#!/usr/bin/env ruby
$:.push('yukkurid/lib')

require 'yukkuri'

aqtalk = Yukkuri::Message.new(STDIN.read).aqtalk
print `echo "#{aqtalk}" | yukkurid/bin/yukkuri`
