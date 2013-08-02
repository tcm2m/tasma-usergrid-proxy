include apt

apt::ppa { 'ppa:chris-lea/node.js': }
->
package { 'nodejs':
  ensure => latest
}
->
package { ['nodemon', 'grunt-cli']:
  ensure => installed,
  provider => npm
}

package { 'af':
  ensure => installed,
  provider => gem
}