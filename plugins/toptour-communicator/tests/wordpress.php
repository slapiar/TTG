<?php
// Real WordPress integration regression. Run only against an isolated local installation.
$root=getenv('TTG_WP_ROOT');if(!$root){fwrite(STDERR,"Set TTG_WP_ROOT to isolated WordPress installation.\n");exit(1);}
require rtrim($root,'/').'/wp-load.php';
$user=get_user_by('login','admin');if(!$user){exit("Missing local admin fixture\n");}wp_set_current_user($user->ID);
if(!class_exists('TTG_Communicator')){exit("Plugin not active\n");}
if(!current_user_can('manage_options')){throw new RuntimeException('CPT registration has broken manage_options');}
$caps=_post_type_meta_capabilities();if(isset($caps['manage_options'])){throw new RuntimeException('Primitive manage_options was registered as a meta capability');}
require_once ABSPATH.'wp-admin/includes/plugin.php';
TTG_Communicator::menu();
global $_registered_pages;
if(empty($_registered_pages['toplevel_page_ttg-joyee'])){throw new RuntimeException('Admin page not registered');}
$id=wp_insert_post(['post_type'=>'ttg_inquiry','post_status'=>'private','post_title'=>'Regression fixture']);
if(!current_user_can('read_post',$id)||!current_user_can('edit_post',$id)){throw new RuntimeException('Admin enquiry permissions broken');}
wp_set_current_user(0);if(current_user_can('read_post',$id)||current_user_can('manage_options')){throw new RuntimeException('Anonymous access incorrectly permitted');}
wp_set_current_user($user->ID);wp_delete_post($id,true);
echo "PASS real WordPress: manage_options intact, admin page registered, admin enquiry access, anonymous denial\n";
