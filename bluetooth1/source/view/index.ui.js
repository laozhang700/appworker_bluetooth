/**
 * related to mainForm.ui
 * 
 * @Author : laozhang700
 * @Timestamp : 2018-08-06
 */


var nf = sm("do_Notification");

//三标准化处理 按键退出系统 开始---------------------------
var app = sm("do_App");
var page = sm("do_Page");
page.on("back", function(){
	app.closePage();
});


var lbl_blue=ui("lbl_blue");

var btn1=ui("btn1");
var btn2=ui("btn2");
var btn3=ui("btn3");

var lblContent=ui("lblContent");
var lblTitle=ui("lblTitle");

var SUUID="";//公共变量
var public_Array=[];

var do_Bluetooth=sm("M0176_Bluetooth");

var do_Timer=mm("do_Timer");
do_Timer.delay=1000;
do_Timer.interval=2000;

do_Timer.on("tick",function(){
    
	var vLen=public_Array.length;
	if(vLen>0){
		
		lblTitle.text="共接受["+vLen+"]数据";
		if(vLen>100){
			vLen=100
		}
		for(var i=vLen-1;i>0;i--){
			
			lblContent.text+=public_Array[i]+"\n";
		}
		
	}
	
})

btn1.on("touch",function(){
	
	var vBool=do_Bluetooth.enable();
	if(vBool){
		do_Bluetooth.startScan(function(data,e){
			
			lbl_blue.text="蓝牙扫描开始["+data+"]";
		});
		
	}
	else{
		nf.alert("打开蓝牙失败！")
	}
	
});

btn2.on("touch",function(){
	
	if(SUUID){
		//开始配对
		do_Bluetooth.connect(SUUID, function(data2, e) {
			lbl_blue.text="链接开始";
		});
	}
	else{
		nf.alert("暂时没有蓝牙！")
	}
	
});

btn3.on("touch",function(){
	
	do_Bluetooth.close();
	lbl_blue.text="蓝牙关闭了";
	
});





//蓝牙
do_Bluetooth.on("scan",function(data,e){
	
	deviceone.print("扫描到设备:"+JSON.stringify(data));
	if(data.name=="HUAWEI nova"){
		SUUID=data.address;//设备的mac地址
		lbl_blue.text="扫描到设备:"+JSON.stringify(data);
	}	
});

do_Bluetooth.on("receive",function(data,e){
	
	deviceone.print("接收到数据:"+JSON.stringify(data));
	//public_str+=data.msg;
	public_Array.push(data.msg);
});

do_Bluetooth.on("connectResult",function(data,e){
	
	if(data.type=="connect"){
		if(data.msg=="true"){
			lbl_blue.text="连接成功:";
			do_Timer.start();
		}
		else{
			lbl_blue.text="连接失败:"+data.msg;
		}
	}
	else if(data.type=="pair"){
		if(data.msg=="true"){
			lbl_blue.text="配对成功:";
			do_Bluetooth.connect(SUUID, function(data2, e) {
				lbl_blue.text="链接开始";
			});
		}
		else{
			lbl_blue.text="配对失败:"+data.msg;
		}
	}
	deviceone.print("接受到数据"+JSON.stringify(data));
	
});