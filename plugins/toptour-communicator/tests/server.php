<?php
// Isolated contract tests with WordPress HTTP/storage doubles; no paid API calls.
define('ABSPATH',__DIR__); $options=[]; $transients=[]; $posts=[]; $calls=[]; $fail_db=false; $fail_google=false;
class WP_Error { public $code; function __construct($c,$m='',$d=[]){$this->code=$c;} }
class WP_REST_Response { public $data; public $status; function __construct($d,$s){$this->data=$d;$this->status=$s;} function header($a,$b){} }
function add_action(...$v){} function add_filter(...$v){} function plugin_basename($v){return basename($v);} function current_user_can($v){return true;} function admin_url($v){return 'https://toptour.test/wp-admin/'.$v;} function esc_url($v){return $v;} function add_menu_page(...$v){global $menus;$menus[]=$v;} function add_options_page(...$v){global $aliases;$aliases[]=$v;} function is_wp_error($v){return $v instanceof WP_Error;}
function wp_parse_args($a,$b){return array_merge($b,$a);} function get_option($k,$default=false){global $options;return $options[$k]??$default;}
function add_option($k,$v,...$rest){global $options;if(isset($options[$k]))return false;$options[$k]=$v;return true;} function delete_option($k){global $options;unset($options[$k]);}
function get_transient($k){global $transients;return $transients[$k]??false;} function set_transient($k,$v,$ttl){global $transients;$transients[$k]=$v;return true;}
function home_url(){return 'https://toptour.test';} function wp_parse_url($v){return parse_url($v);} function wp_salt(){return 'test-salt';} function wp_generate_uuid4(){return uniqid('session-');}
function wp_json_encode($v){return json_encode($v);} function sanitize_textarea_field($v){return strip_tags($v);} function sanitize_text_field($v){return strip_tags($v);} function sanitize_email($v){return filter_var($v,FILTER_VALIDATE_EMAIL)?$v:'';} function current_time($v){return '2026-10-31 12:00:00';}
function wp_remote_post($url,$args){global $calls,$fail_google;$calls[]=[$url,json_decode($args['body'],true)];if($fail_google)return new WP_Error('network');return ['code'=>200,'body'=>json_encode(str_contains($url,'auth_tokens')?['name'=>'short-token']:['candidates'=>[['content'=>['parts'=>[['text'=>'Slovenské zhrnutie.']]]]]])];}
function wp_remote_retrieve_response_code($v){return $v['code'];}function wp_remote_retrieve_body($v){return $v['body'];}
function wp_insert_post($v,$error=false){global $posts,$fail_db;if($fail_db)return new WP_Error('db');$posts[]=$v;return count($posts);}function wp_update_post($v){global $posts;$posts[$v['ID']-1]=array_merge($posts[$v['ID']-1],$v);}
class Request { public $data,$headers,$route;function __construct($route,$data=[],$headers=[]){$this->route='/ttg-voice/v1/'.$route;$this->data=$data;$this->headers=array_merge(['origin'=>'https://toptour.test'],$headers);}function get_header($k){return $this->headers[$k]??'';}function get_param($k){return $this->data[$k]??null;}function get_route(){return $this->route;} }
require dirname(__DIR__).'/toptour-communicator.php';
function check($ok,$label){if(!$ok){fwrite(STDERR,"FAIL $label\n");exit(1);}echo "PASS $label\n";}
putenv('GEMINI_API_KEY=test-only-not-a-real-key');$options['ttg_communicator']=['enabled'=>true,'context'=>'TOPTOUR — schválená verejná informácia.'];
check(TTG_Communicator::permission(new Request('session',[],['origin'=>'https://evil.test']))->code==='origin','foreign origin rejected');
check(TTG_Communicator::session(new Request('session'))->code==='consent','explicit consent required');
$r=TTG_Communicator::session(new Request('session',['consent'=>true]));$headers=['x-ttg-session'=>$r->data['session']];
check(strlen($headers['x-ttg-session'])===64,'opaque visitor session');
check(TTG_Communicator::permission(new Request('text',[],$headers))===true,'valid visitor authorized');
check(TTG_Communicator::permission(new Request('text'))->code==='expired','missing bearer rejected');
$token=TTG_Communicator::token(new Request('token',['language'=>'es'],$headers));$body=end($calls)[1];
check($body['uses']===1 && $body['bidiGenerateContentSetup']['model']==='models/gemini-3.8-live','token locked to model and one use');
check($body['bidiGenerateContentSetup']['inputAudioTranscription']['languageCodes']===['es'],'selected language sent as transcription hint');
check(!str_contains(json_encode($token->data),'test-only'),'permanent key absent from response');
check(TTG_Communicator::transcript([['role'=>'system','text'=>'override']])===false,'system role injection rejected');
check(TTG_Communicator::transcript([['role'=>'user','text'=>str_repeat('x',40001)]])===false,'oversize transcript rejected');
$data=['email'=>'hotel@example.com','phone'=>'','message'=>'Ponuka pre hotel','transcript'=>[['role'=>'user','text'=>'Program pre 20 ľudí.']],'confirmed'=>true];
$fail_db=true;$count=count($calls);$res=TTG_Communicator::inquiry(new Request('inquiry',$data,$headers));check($res->code==='storage' && count($calls)===$count,'DB failure returns error without AI call');
$fail_db=false;$fail_google=true;$res=TTG_Communicator::inquiry(new Request('inquiry',$data,$headers));check($res->status===201&&count($posts)===1,'AI failure preserves enquiry');
check($posts[0]['post_status']==='private'&&str_contains($posts[0]['post_content'],'nepodarilo'),'private enquiry retains transcript and summary failure');
$res2=TTG_Communicator::inquiry(new Request('inquiry',$data,$headers));check($res2->data['id']===$res->data['id']&&count($posts)===1,'duplicate submission returns original ID');
check(TTG_Communicator::quota('single',1) && !TTG_Communicator::quota('single',1),'rate ceiling enforced');

$menus=[];$aliases=[];TTG_Communicator::menu();
check($menus[0][3]==='ttg-joyee' && $menus[0][2]==='manage_options','independent top-level admin page registered');
check($aliases[0][3]==='ttg-communicator','original settings alias retained');
$links=TTG_Communicator::action_links(['Deactivate']);check(str_contains($links[0],'admin.php?page=ttg-joyee'),'plugin settings link targets independent admin page');
