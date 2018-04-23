package org.cocos.unkchess.wxapi;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.cocos.unkchess.R;
import org.cocos2dx.javascript.AppActivity;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;

import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.mm.sdk.modelmsg.WXImageObject;
import com.tencent.mm.sdk.modelmsg.WXMediaMessage;
import com.tencent.mm.sdk.modelmsg.WXTextObject;
import com.tencent.mm.sdk.modelmsg.WXWebpageObject;
import com.tencent.mm.sdk.modelpay.PayReq;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{

	public static IWXAPI api           = null;
	public static AppActivity activity = null;
	public static String app_id        = "";
	public static String state         = null;
	public static String s_code        = "";
	
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        api.handleIntent(getIntent(), this);
    }
	
	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		
		setIntent(intent);
        api.handleIntent(intent, this);
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data)
	{
		System.out.println("-----Activity CreateOver-----" + resultCode);
	}
	
	public static void WXSDKLog(String str)
	{
		Log.d("WeChatSDK", "[WeChatSDK]:" + str);
	}

	//初始化
	public static void Init(AppActivity activity)
	{
		System.out.println("----------WXEntryActivity Init----------");
		WXEntryActivity.activity = activity;
	}

	//注册app_id
	public static void RegisterAppID(String app_id)
	{
		System.out.println("----------WXEntryActivity RegisterAppID----------");
		WXEntryActivity.app_id = app_id;
		api = WXAPIFactory.createWXAPI(WXEntryActivity.activity, app_id, true);
		
	}

	//发送auth请求
	public static void SendAuthRequest(String scope, String state)
	{
		System.out.println("------------------SendAuthRequest------------------");
		final SendAuth.Req req = new SendAuth.Req();
		req.scope = scope;
		req.state = state;
		WXEntryActivity.state = state;
		api.sendReq(req);
	}



	@Override
	public void onResp(BaseResp resp) {
		System.out.println("====================onResp====================" + resp.errCode);
		switch (resp.errCode) {
		case BaseResp.ErrCode.ERR_OK:
			if (resp instanceof SendAuth.Resp)
			{
				SendAuth.Resp auth_resp = (SendAuth.Resp)resp;
				if (auth_resp.state.equals(WXEntryActivity.state))
				{	
					// cocos creator
					//System.out.println("====================Cocos2dxJavascriptJavaBridge===================="+s_code);
					//Cocos2dxJavascriptJavaBridge.evalString("cc.Client.WechatPlatformManager.setAccessTokenCode(\"111111111\")");
					System.out.println("==================== will call Cocos2dxJavascriptJavaBridge====================");
					s_code = auth_resp.code;
					WXEntryActivity.activity.runOnGLThread(new Runnable() {
						@Override
						public void run() {
						 	System.out.println("====================Cocos2dxJavascriptJavaBridge===================="+s_code);
							Cocos2dxJavascriptJavaBridge.evalString("cc.Client.WechatPlatformManager.wechatOnRespone(\"" + s_code + "\")");
						}
					 });

					// cocos2d-x lua
					//SetAccessTokenCode(auth_resp.code);
				}
			}else if(resp instanceof SendMessageToWX.Resp)
			{
				if (resp.transaction.equals("Share_Linke_Type1"))
				{
					// 分享成功后的回调
					//SetShareResult(1);
				}else if (resp.transaction.equals("Share_Linke_Type2"))
				{
					// 分享成功后的回调
					//SetShareResult(2);
				} else if (resp.transaction.equals("Share_Linke_Type")){
					System.out.println("share image success");
				}
			}
			break;
		case BaseResp.ErrCode.ERR_USER_CANCEL:
			WXSDKLog("-----用户取消------");
			break;
		case BaseResp.ErrCode.ERR_AUTH_DENIED:
			WXSDKLog("-----认证被否决------");
			break;
		case BaseResp.ErrCode.ERR_COMM:
			WXSDKLog("-----一般错误------");
			break;
		case BaseResp.ErrCode.ERR_UNSUPPORT:
			WXSDKLog("-----不支持错误------");
			break;
		default:
			WXSDKLog("-----未知错误------");
			break;
		}
		
		if (resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX)
		{
			if (resp.errCode == BaseResp.ErrCode.ERR_OK)
			{
				WXSDKLog("-----支付成功！------");
				SetPayResult(0);
			}else
			{
				WXSDKLog("-----支付失败！------");
				SetPayResult(1);
			}
		}
		
		finish();
	}

	//打开wx客户端
	public static void OpenWXApp()
	{
		api.openWXApp();	
	}

	//wifi
    public static float SdkAskNetSignal()         
    {  
        return 1;//((WifiManager)getSystemService(WIFI_SERVICE)).getConnectionInfo().getRssi();  
    }  

    //电量剩余
    @SuppressWarnings("deprecation")  
    public static float SdkAskBattery()            
    {  
        int sdkVersion;  
        float battery = 1;    
        try   
        {    
            sdkVersion = Integer.valueOf(android.os.Build.VERSION.SDK);   
            
        }   
        catch (NumberFormatException e)   
        {    
            sdkVersion = 0;    
            
        }   
        if (sdkVersion >= 21)                      
        {  
            
        }  
        else   
        {  
           
          
        }  
        return battery;  
    }  

    public static String getAccessTokenCode(){
    	return s_code;
    }

	//检查wx客户端是否安装
	public static boolean CheckWXInstalled()
	{
		return api.isWXAppInstalled();
	}

	public static byte[] Bitmap2Bytes(Bitmap bm) 
	{ 
		ByteArrayOutputStream baos = new ByteArrayOutputStream();  
		bm.compress(Bitmap.CompressFormat.PNG, 100, baos); 
		return baos.toByteArray();
	}

	//type:1 好友 2 朋友圈
	public static boolean ShareLinkToWeChat(String link, String title, String desc, int type)
	{
		WXWebpageObject webpage = new WXWebpageObject();
		webpage.webpageUrl = link;
		WXMediaMessage msg = new WXMediaMessage(webpage);
		msg.title = title;
		msg.description = desc;
		//图片<32k 
		InputStream stream = WXEntryActivity.activity.getResources().openRawResource(R.drawable.share_icon);
		Bitmap bitmap = BitmapFactory.decodeStream(stream);
		msg.thumbData = Util.bmpToByteArray(bitmap, true);
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = "Share_Linke_Type" + type;
		req.message = msg;
		if (type == 1)
		{
			req.scene = SendMessageToWX.Req.WXSceneSession;
		}else
		{
			req.scene = SendMessageToWX.Req.WXSceneTimeline;
		}
		return api.sendReq(req); 
	}
	
	public static boolean ShareImageToWeChat(String path)
	{
		String full_img_path = path + "wechat_share_image_screenshot.png";
		WXImageObject imageObject = new WXImageObject();
		
		BitmapFactory.Options options = new BitmapFactory.Options();
		options.inJustDecodeBounds = true;
		Bitmap tmp = BitmapFactory.decodeFile(full_img_path);
		Bitmap thBitmap = Bitmap.createScaledBitmap(tmp, 768, 432, true);
		imageObject.imageData = Util.bmpToByteArray(thBitmap, true);
		WXMediaMessage msg = new WXMediaMessage(imageObject);
		//图片<32k 
		Bitmap mini_bmp = Bitmap.createScaledBitmap(tmp, 160, 90, true);
		msg.thumbData = Util.bitmap2BytesMini(mini_bmp, 30);
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = "Share_Image_Type";
		req.message = msg;
		req.scene = SendMessageToWX.Req.WXSceneSession;
		return api.sendReq(req); 
	}
	
	//type:1 好友 2 朋友圈
	public static boolean ShareToWeChat(String content_txt, int type)
	{
	
		WXTextObject textObj = new WXTextObject();
		textObj.text = content_txt;

	
		WXMediaMessage msg = new WXMediaMessage();
		msg.mediaObject = textObj;

		msg.description = content_txt;

		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = "Share_Text_Type" + type;
		req.message = msg;
		if (type == 1)
		{
			req.scene = SendMessageToWX.Req.WXSceneSession;
		}else
		{
			req.scene = SendMessageToWX.Req.WXSceneTimeline;
		}

		return api.sendReq(req);
	}
	
	public static void StartPay(String partner_id, String prepay_id, String nonce_str, int timestamp, String sign)
	{
		WXSDKLog("---partner_id=" + partner_id + "--prepay_id=" + prepay_id + "--nonce_str=" + nonce_str + "--timestarmp=" + timestamp + "--sign=" + sign);
		PayReq req = new PayReq();
		req.appId = app_id;
		req.partnerId = partner_id;
		req.prepayId = prepay_id;
		req.nonceStr = nonce_str;
		req.packageValue = "Sign=WXPay";
		req.sign = sign;
		req.timeStamp = timestamp + "";
		api.sendReq(req);
	}
	
	public static boolean CheckAccessTokenValid()
	{
		return false;
	}
	

	@Override
	public void onReq(BaseReq req) {
		switch (req.getType()) {
		case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
			WXSDKLog("------微信向第三方app请求消息数据-------");
			//goToGetMsg();
			break;
		case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
			WXSDKLog("------微信向第三方app请求显示消息数据-------");
			break;
		case ConstantsAPI.COMMAND_PAY_BY_WX:
			WXSDKLog("------第三方通过微信支付-------");
			break;
		default:
			break;
		}
	}
	

	private void goToGetMsg() {
		Intent intent = new Intent(this, AppActivity.class);
		intent.putExtras(getIntent());
		startActivity(intent);
		finish();
	}
	// cocos2d-x lua
	//public native static void SetAccessTokenCode(String code);
	public native static void SetShareResult(int type);
	public native static void SetPayResult(int result);
}
