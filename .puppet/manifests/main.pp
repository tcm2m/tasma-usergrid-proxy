include apt

apt::ppa { 'ppa:chris-lea/node.js': }
->
package { 'nodejs':
  ensure => latest
}
->
package { ['nodemon', 'grunt-cli']:
  ensure => latest,
  provider => npm
}

package { 'af':
  ensure => installed,
  provider => gem
}