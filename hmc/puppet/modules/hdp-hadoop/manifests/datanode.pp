class hdp-hadoop::datanode(
  $service_state = $hdp::params::cluster_service_state,
  $opts = {}
) inherits hdp-hadoop::params 
{

  $hdp::params::service_exists['hdp-hadoop::datanode'] = true

  Hdp-hadoop::Common<||>{service_states +> $service_state}

  if ($hdp::params::use_32_bits_on_slaves == true) {
    Hdp-hadoop::Package<||>{include_32_bit => true}
    Hdp-hadoop::Configfile<||>{sizes +> 32}
  } else {
    Hdp-hadoop::Package<||>{include_64_bit => true}
    Hdp-hadoop::Configfile<||>{sizes +> 64}
  }

  if ($service_state == 'no_op') {
  } elsif ($service_state in ['running','stopped','installed_and_configured','uninstalled']) { 
    $dfs_data_dir = $hdp-hadoop::params::dfs_data_dir
  
    if (($hdp::params::service_exists['hdp-hadoop::namenode'] == true) or ($hdp::params::service_exists['hdp-hadoop::snamenode'] == true)){
      $a_namenode_on_node = true
    } else {
      $a_namenode_on_node = false
    }

    #adds package, users and directories, and common hadoop configs
    include hdp-hadoop::initialize
  
    hdp-hadoop::datanode::create_data_dirs { $dfs_data_dir: 
      service_state => $service_state
    }

    if ($a_namenode_on_node == true){
      $create_pid_dir = false
      $create_log_dir = false
    } else {
      $create_pid_dir = true
      $create_log_dir = true
    }
    
    hdp-hadoop::service{ 'datanode':
      ensure         => $service_state,
      user           => $hdp-hadoop::params::hdfs_user,
      create_pid_dir => $create_pid_dir,
      create_log_dir => $create_log_dir
    }
    
    #top level does not need anchors
    Class['hdp-hadoop'] -> Hdp-hadoop::Service['datanode']
    Hdp-hadoop::Datanode::Create_data_dirs<||> -> Hdp-hadoop::Service['datanode']
  } else {
    hdp_fail("TODO not implemented yet: service_state = ${service_state}")
  }
}

define hdp-hadoop::datanode::create_data_dirs($service_state)
{
  $dirs = hdp_array_from_comma_list($name)
  hdp::directory_recursive_create { $dirs :
    owner => $hdp-hadoop::params::hdfs_user,
    mode => '0750',
    service_state => $service_state,
    force => true
  }
}
