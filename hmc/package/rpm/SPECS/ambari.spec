##
#
#/*
# * Licensed to the Apache Software Foundation (ASF) under one
# * or more contributor license agreements.  See the NOTICE file
# * distributed with this work for additional information
# * regarding copyright ownership.  The ASF licenses this file
# * to you under the Apache License, Version 2.0 (the
# * "License"); you may not use this file except in compliance
# * with the License.  You may obtain a copy of the License at
# *
# *     http://www.apache.org/licenses/LICENSE-2.0
# *
# * Unless required by applicable law or agreed to in writing, software
# * distributed under the License is distributed on an "AS IS" BASIS,
# * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# * See the License for the specific language governing permissions and
# * limitations under the License.
# */

#
# RPM Spec file for Ambari
#

Summary: Ambari
Name: ambari
Version: 1.0.0
URL: http://incubator.apache.org/projects/ambari.html
Release: 1%{?dist}
License: Apache License, Version 2.0
Vendor: Apache Software Foundation (ambari-dev@incubator.apache.org)
Group: System Environment/Base
Source: %{name}-%{version}.tar.gz
Source1: ambari.init.in
Source3: ambari-agent.init.in
BuildRoot: %{_tmppath}/%{name}-%{version}-buildroot
Requires: php >= 5, sqlite >= 3, php-pdo, php-pecl-json, httpd, puppet = 2.7.9, pdsh, httpd-devel, ruby-devel, rubygems, mod_passenger, mod_ssl
%define web_prefixdir %{_prefix}/share/hmc
%define httpd_confdir %{_sysconfdir}/httpd/conf.d
%define puppet_master_dir %{_sysconfdir}/puppet/master
%define hmc_passwd_dir %{_sysconfdir}/hmc
%define hmc_db_dir %{_var}/db/hmc
%define hmc_run_dir %{_var}/run/hmc
%define hmc_log_dir %{_var}/log/hmc
%define hmc_agent_dir %{_sysconfdir}/hmc
BuildArch: noarch


%description
This package provides a Management Console for Hadoop Cluster.

%package agent
Summary: agent for Ambari
Group:  System/Daemons
Requires: puppet = 2.7.9 
BuildArch: noarch
%description agent
This package provides a Management Console for Hadoop Cluster. 


%prep
%setup -q -n %{name}-%{version}

%build
%pre
# Make a backup of existing database before installing new package
if [ -f /var/db/hmc/data/data.db ]; then
  DATE=`date +%d-%m-%y-%H%M`
  mv /var/db/hmc/data/data.db /var/db/hmc/data/data.db.$DATE
fi


%install
# Flush any old RPM build root
%__rm -rf $RPM_BUILD_ROOT
%__install -D -m0755 "%{SOURCE1}" "$RPM_BUILD_ROOT/etc/init.d/%{name}"
%__install -D -m0755 "%{SOURCE3}" "$RPM_BUILD_ROOT/etc/init.d/%{name}-agent"
%__mkdir -p $RPM_BUILD_ROOT/usr/lib/ruby/site_ruby/1.8/puppet/reports/
%__mkdir -p $RPM_BUILD_ROOT/%{web_prefixdir}/
%__mkdir -p $RPM_BUILD_ROOT/%{web_prefixdir}/bin/
%__mkdir -p $RPM_BUILD_ROOT/%{puppet_master_dir}/
%__mkdir -p $RPM_BUILD_ROOT/%{puppet_master_dir}/manifests
%__mkdir -p $RPM_BUILD_ROOT/%{web_prefixdir}/
%__install -d "%{buildroot}%{hmc_db_dir}"
%__install -d "%{buildroot}%{hmc_log_dir}"
%__install -d "%{buildroot}%{hmc_run_dir}"
%__install -d "%{buildroot}%{hmc_run_dir}/downloads"
%__mkdir -p $RPM_BUILD_ROOT/%{hmc_db_dir}/data
%__mkdir -p $RPM_BUILD_ROOT/%{hmc_passwd_dir}
%__mkdir -p $RPM_BUILD_ROOT/%{httpd_confdir}/
%__cp -rf css $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf fonts $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf licenses $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf db $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf html $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf ShellScripts $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf images $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf js $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf puppet $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf php $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -f fileCombinator.php $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf conf $RPM_BUILD_ROOT/%{web_prefixdir}/
%__cp -rf puppet/manifestloader $RPM_BUILD_ROOT/%{puppet_master_dir}
%__cp -rf puppet/modules $RPM_BUILD_ROOT/%{puppet_master_dir}
%__mkdir -p $RPM_BUILD_ROOT/%{puppet_master_dir}/modules/catalog/files
%__install -D -m0755 puppet/reports/get_revision $RPM_BUILD_ROOT/%{web_prefixdir}/bin
%__cp -rf puppet/reports/hmcreport.rb $RPM_BUILD_ROOT/usr/lib/ruby/site_ruby/1.8/puppet/reports/
 

%post
if test X"$RPM_INSTALL_PREFIX0" = X"" ; then
  RPM_INSTALL_PREFIX0="/usr"
fi

echo "Alias /hdp $RPM_INSTALL_PREFIX0/share/hdp" > /etc/httpd/conf.d/hdp_mon_dashboard.conf
php $RPM_INSTALL_PREFIX0/share/hmc/php/frontend/initializeHMC.php /var/db/hmc/data/data.db $RPM_INSTALL_PREFIX0/share/hmc/db/schema.dump
sed -i 's/User\ apache/User\ puppet/g' /etc/httpd/conf/httpd.conf
chmod 666 /var/db/hmc/data/data.db
chown -R puppet:apache /var/db/hmc/
chown -R puppet:apache /var/run/hmc
chown -R puppet:apache /var/log/hmc
chown -R puppet:apache /etc/puppet
mkdir -p /etc/puppet/rack/public
mkdir -p /etc/puppet/rack/tmp
touch /var/run/hmc/lockfile
chown puppet:apache /var/run/hmc/lockfile
touch /var/run/hmc/lockfile.clusterstate
chown puppet:apache /var/run/hmc/lockfile.clusterstate
cp /usr/share/puppet/ext/rack/files/config.ru /etc/puppet/rack
chown puppet /etc/puppet/rack/config.ru

cp $RPM_INSTALL_PREFIX0/share/hmc/puppet/conf/puppetmaster.conf.template /etc/httpd/conf.d/puppetmaster.conf
cp $RPM_INSTALL_PREFIX0/share/hmc/conf/hmc.conf /etc/httpd/conf.d/hmc.conf
host=`hostname -f | tr '[:upper:]' '[:lower:]'`
sed -i "s/__TODO_HOSTNAME__/$host/g" /etc/httpd/conf.d/puppetmaster.conf
cp $RPM_INSTALL_PREFIX0/share/hmc/puppet/conf/puppet.conf.template /etc/puppet/puppet.conf
echo 0 > /selinux/enforce
htpasswd -mbc /etc/hmc/htpasswd.users hmcadmin hmcadmin &> /dev/null
#chown apache:apache /var/db/hmc/data/data.db
chown -R puppet:apache /etc/hmc

%postun
rm -rf /var/run/hmc/clusters/
rm -rf /var/lib/puppet/reports/*
rm -rf /var/lib/puppet/puppet_kick_version.txt
rm -rf /etc/puppet/master
rm -rf /var/run/hmc/license
rm -rf /var/run/hmc/puppetmaster.boot

%files
%defattr(-,root,root)
%{web_prefixdir}/*
/usr/lib/ruby/site_ruby/1.8/puppet/reports/hmcreport.rb
%config /etc/init.d/%{name}
%{hmc_passwd_dir}*
%{puppet_master_dir}/*
%{hmc_db_dir}
%{hmc_log_dir}
%{hmc_run_dir}/*

%files agent
/etc/init.d/ambari-agent
%{hmc_agent_dir}

#%clean
#%__rm -rf $RPM_BUILD_ROOT
%changelog
* Thu Jun 07 2012 Ambari <ambari-dev@incubator.apache.org>
- Initial version
