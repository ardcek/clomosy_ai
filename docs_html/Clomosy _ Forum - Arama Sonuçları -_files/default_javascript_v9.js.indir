/* *******************************************************
Software: Web Wiz Forums
Info: http://www.webwizforums.com
Copyright: (C)2001-2012 Web Wiz Ltd. All rights reserved
******************************************************* */

//function to change page from option list
function linkURL(URL) {
	if (URL.options[URL.selectedIndex].value != "") self.location.href = URL.options[URL.selectedIndex].value;
	return true;
}

//function to open pop up window
function winOpener(theURL, winName, scrollbars, resizable, width, height) {

	winFeatures = 'left=' + (screen.availWidth-10-width)/2 + ',top=' + (screen.availHeight-30-height)/2 + ',scrollbars=' + scrollbars + ',resizable=' + resizable + ',width=' + width + ',height=' + height + ',toolbar=0,location=0,status=1,menubar=0'
  	window.open(theURL, winName, winFeatures);
}

//function to build select options
function buildSelectOptions(target, pageLink, pageQueryStrings, totalPages, pagePostingNum){
  	
  	var listOption = document.getElementById(target);
  	
  	for(var pageNum=1; pageNum <= totalPages; pageNum++){
    		var option = document.createElement('option');
    		
    		option.innerHTML = pageNum;
    		option.setAttribute('value', pageLink + 'PN=' + pageNum + pageQueryStrings);
    		
   		if(pageNum == pagePostingNum){
      			option.setAttribute('selected', 'selected');
    		}
    		
    		listOption.appendChild(option);
  	}
}

//Show drop down
function showDropDown(parentEle, dropDownEle, dropDownWidth, offSetRight){

	parentElement = document.getElementById(parentEle);
	dropDownElement = document.getElementById(dropDownEle)

	//position
	dropDownElement.style.left = (getOffsetLeft(parentElement) - offSetRight) + 'px';
	dropDownElement.style.top = (getOffsetTop(parentElement) + parentElement.offsetHeight + 3) + 'px';

	//width
	dropDownElement.style.width = dropDownWidth + 'px';

	//display
	hideDropDown();
	dropDownElement.style.visibility = 'visible';


	//Event Listener to hide drop down
	if(document.addEventListener){ // Mozilla, Netscape, Firefox
		document.addEventListener('mouseup', hideDropDown, false);
	} else { // IE
		document.onmouseup = hideDropDown;
	}
}

//Hide drop downs
function hideDropDown(){
	hide('div');
	hide('iframe');
	function hide(tag){
		var classElements = new Array();
		var els = document.getElementsByTagName(tag);
		var elsLen = els.length;
		var pattern = new RegExp('(^|\\s)dropDown(.*\)');

		for (i = 0, j = 0; i < elsLen; i++){
			if (pattern.test(els[i].className)){
				els[i].style.visibility='hidden';
				j++;
			}
		}
	}
}


//Top offset
function getOffsetTop(elm){
	var mOffsetTop = elm.offsetTop;
	var mOffsetParent = elm.offsetParent;
	while(mOffsetParent){
		mOffsetTop += mOffsetParent.offsetTop;
		mOffsetParent = mOffsetParent.offsetParent;
	}
	return mOffsetTop;
}

//Left offset
function getOffsetLeft(elm){
	var mOffsetLeft = elm.offsetLeft;
	var mOffsetParent = elm.offsetParent;
	while(mOffsetParent){
		mOffsetLeft += mOffsetParent.offsetLeft;
		mOffsetParent = mOffsetParent.offsetParent;
	}
	return mOffsetLeft;
}

//AJAX
var xmlHttp;
var xmlHttpResponseID;

//create XMLHttpRequest object
function createXMLHttpRequest(){
	if (window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
	}else if (window.ActiveXObject){
		xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
		if (! xmlHttp){
			xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
		}
	}
}

//XMLHttpRequest event handler
function XMLHttpResponse(){
	if (xmlHttp.readyState == 4 || xmlHttp.readyState=='complete'){
		if (xmlHttp.status == 200){
			xmlHttpResponseID.innerHTML = xmlHttp.responseText;
		}else {
			xmlHttpResponseID.innerHTML = '<strong>Error connecting to server</strong>';
		}

	}
}

//Get AJAX data
function getAjaxData(url, elementID){
	xmlHttpResponseID = document.getElementById(elementID);
	xmlHttpResponseID.innerHTML = '<img alt="" src="forum_images/wait16.gif" style="vertical-align:text-top" width="16" height="16" />';
	createXMLHttpRequest();
	xmlHttp.onreadystatechange = XMLHttpResponse;
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

//Fade and unfade image
function fadeImage(imageItem){
	imageItem.style.opacity = 0.4;
}
function unFadeImage(imageItem){
	imageItem.style.opacity = 1;
}