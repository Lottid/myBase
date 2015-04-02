// JavaScript Document
(function($){
    $.fn.gypDate = function(options){
        var defaults = {
        	              
        }
        var options = $.extend(defaults, options),	
			Month = {"0":"January","1":"February","2":"March","3":"April","4":"May","5":"June","6":"July","7":"August","8":"September","9":"October","10":"November","11":"December"},
			myDate = {};
		//获取初始参数
		var _date = new Date(),
			_year = _nowyear =_date.getFullYear(),
			_month = _nowmonth = _date.getMonth(),
			_today = _nowtoday = _date.getDate();
		
		//模板
		var dayTmpl = '<li></li>',
			dayTmplAll = '';
		for(var i = 0; i < 41;i++) {
			dayTmplAll = dayTmplAll + '' +dayTmpl;
		}
		var dateTmpl =  '<div class="date_top_area">'+
							'<div class="date_my_area">'+
								'<span class="date_my_txt">'+
									'<label class="date_month"></label>'+
									'<label class="date_year"></label>'+
								'</span>'+
								'<a href="#" class="gyp_date_left_btn"></a>'+
								'<a href="#" class="gyp_date_right_btn"></a>'+
							'</div>'+
							'<div class="date_st_area">'+
								'<ul>'+
									'<li>日</li>'+
									'<li>一</li>'+
									'<li>二</li>'+
									'<li>三</li>'+
									'<li>四</li>'+
									'<li>五</li>'+
									'<li>六</li>'+
								'</ul>'+
							'</div>'+
						'</div>'+
						'<div class="date_con_area">'+
							'<ul class="date_ul">'+dayTmplAll+'</ul>'+
						'</div>';
		//获取参数
		var date = $(this);
		date.append(dateTmpl);
		var	dateMonth = date.find(".date_month"),
			dateYear = date.find(".date_year"),
			dateLi = date.find(".date_ul li"),
			dateLeftBtn = date.find(".gyp_date_left_btn"),
			dateRightBtn = date.find(".gyp_date_right_btn");
		//date.append(dateTmpl);
		//函数
		var days = function(year,month)
			{
				var d = new Date(year,month+1,0);
				return d.getDate();
			}
		var week = function(year,month)
			{
				var _date = new Date(year,month+1,0);
				_date.setDate(1);
				return _date.getDay();
			}
		var mydate =  function(year,month,week,alldays,today) {
			if(_nowyear==year&&_nowmonth==month)today=_nowtoday;
			myDate['year'] = year;
			myDate['month'] = month;
			myDate['today'] = _nowtoday;
			dateMonth.html(Month[month]);
			dateYear.html(year);
			dateLi.removeClass();
			for(var i = 0; i < 42;i++) {
				if(week==0) week=7;
				if(i < week) {
					var _daysforlast = days(year,month-1);
					var k = _daysforlast - week + i + 1;
					dateLi.eq(i).html(k).addClass("date_days_li01");
				}else {
					if(i < (alldays+week)) {
						dateLi.eq(i).html(i - week + 1);
						if((i - week + 1) == today) {
							dateLi.eq(i).addClass("date_days_li02");
						}
					} else {
						var j = i- alldays - week + 1;
						dateLi.eq(i).html(j).addClass("date_days_li01");
					}	
				}
			}
		}
		//初始当前时间
		var _week = week(_year,_month);
		var _alldays = days(_year,_month);
		mydate(_year,_month,_week,_alldays,_today);
		//绑定上下月
		dateLeftBtn.click(function() {
			_month--
			if(_month<=0) {
				_month=11;
				_year--
			}
			_week = week(_year,_month);
			_alldays = days(_year,_month);
			mydate(_year,_month,_week,_alldays,1);
		});
		dateRightBtn.click(function() {
			_month++
			if(_month>11) {
				_month=0;
				_year++
			}
			_week = week(_year,_month);
			_alldays = days(_year,_month);
			mydate(_year,_month,_week,_alldays,1);
		});
		dateLi.click(function() {
			dateLi.removeClass("date_days_li02");
			$(this).addClass("date_days_li02");
			//获取选中日期
			var nowYear = dateYear.html(),
				nowMonth = dateMonth.html(),
				nowDays = $(this).html();
			myDate['year'] = nowYear;
			myDate['month'] = nowMonth;
			myDate['today'] = nowDays;
			return myDate;
		});
		return myDate;
	};
})(jQuery);