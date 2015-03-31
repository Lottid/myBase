;(function(root, factory){
    if(typeof exports === 'object' && exports){
        // commonjs
        factory(module.exports);
    } else {
        var Alt = {};
        factory(Alt);
        if(typeof define === 'function' && define.amd){
            // AMD
            define(Alt);
        } else {
            // script
            root.Alt = root.thisAlt = Alt;
        }
    }
})(this, function(Alt, undefined){
	//编辑-确认编辑视频
	Alt.editVideo = function(editBtn) {
		var editBtn = $(editBtn);
		editBtn.on("click",function() {
			var dClear = dialog({
				innerHTML:
			        '<div i="dialog" class="ui-dialog">'
			        +  '<div class="alt-area-title"><span>视频编辑操作确认</span><button i="close" class="ui-dialog-close alt-cls"></button></div>'
			        +  '<div i="content" class="ui-dialog-content alt-con"></div>'
			        +'</div>',
				backdropOpacity:0.7,
			    title: 'message',
			    content: '<div class="art-content">'
						+   '<div class="art-content"-text">该视频已被相关课程使用，编辑内容可能会对用户学习造成影响，确定要编辑内容吗?</div>'
						+   '<div class="alt-btn clearfix">'
						+       '<span class="alt-btn-left">清空</span>'
						+       '<span class="alt-btn-right">取消</span>'
						+   '</div>'
						+'</div>'
			});
			$(".alt-btn-right").on("click",function() {
				dClear.close();
			});
			dClear.showModal();
		});
	};
	//弹层-预览视频
	Alt.previewVideo = function(previewBtn) {
		var previewBtn = $(previewBtn),
			src = previewBtn.attr("xsrc");
		previewBtn.on("click",function() {
			if(src != null||src != "") {
				var dVideo = dialog({
					innerHTML:
				        '<div i="dialog" class="ui-dialog">'
				        +  '<div class="alt-area-title"><span>视频编辑操作确认</span><button i="close" class="ui-dialog-close alt-cls"></button></div>'
				        +  '<div i="content" class="ui-dialog-content alt-video-con"></div>'
				        +'</div>',
					backdropOpacity:0.7,
				    title: 'message',
				    content: '<script src='
							+   src
							+ 'type="text/javascript"'
							+'><\/script>'
				});
				dVideo.showModal();
			} else {
				alert("该视频不可预览！");
			}
		});
	};
	//弹层--树
//	Alt.showTree= function(previewBtn) {
//		var previewBtn = $(previewBtn);
//		previewBtn.on("click",function() {
//			var dZtree = dialog({
//				innerHTML:
//			        '<div i="dialog" class="ui-dialog">'
//			        +  '<div class="alt-area-title"><span>选择分类</span><button i="close" class="ui-dialog-close alt-cls"></button></div>'
//			        +  '<div i="content" class="ui-dialog-content alt-tree-con"></div>'
//			        +'</div>',
//				backdropOpacity:0.7,
//			    title: 'message',
//				content: '<div class="right-tree">'
//						+	'<ul id="treeDemo" class="ztree">'
//						+'</div>'
//						+'<div class="tree-btn">'
//						+	'<div class="tree-btn-con clearfix">'
//						+		'<span class="tree-btn-left fl">确认</span>'
//						+		'<span class="tree-btn-right fr">取消</span>'
//						+	'</div>'
//						+'</div>'
//						
//			});
//			dZtree.showModal();
//			var setting = {
//				data: {
//					simpleData: {
//						enable: true
//					}
//				}
//			};
//			var zNodes =[
//				{ id:1, pId:0, name:"一级分类1", open:true},
//				{ id:11, pId:1, name:"二级分类1"},
//				{ id:12, pId:1, name:"二级分类1"},
//				{ id:34, pId:12, name:"二级分类1"},
//				{ id:35, pId:12, name:"二级分类1"},
//				{ id:36, pId:35, name:"二级分类1"},
//				{ id:37, pId:36, name:"二级分类1"},
//				{ id:2, pId:0, name:"一级分类2", open:false},
//				{ id:21, pId:2, name:"二级分类1"},
//				{ id:22, pId:2, name:"二级分类1"},
//				{ id:23, pId:2, name:"二级分类1"},
//				{ id:3, pId:0, name:"一级分类 3", open:false},
//				{ id:31, pId:3, name:"二级分类1"},
//				{ id:32, pId:3, name:"二级分类1"},
//				{ id:33, pId:3, name:"二级分类1"}
//			];
//			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
//			$('.right-tree').perfectScrollbar();
//		});
//	};
	Alt.qeusTrMeun = function() {
		var quesTbody = $(".right-ques-tbody");
		quesTbody.on("click",".right-ques-name .right-ques-add",function() {
			var addTable = dialog({
				innerHTML:
			        '<div i="dialog" class="ui-dialog">'
			        +  '<div class="alt-area-title"><span>添加选项</span><button i="close" class="ui-dialog-close alt-cls"></button></div>'
			        +  '<div i="content" class="ui-dialog-content alt-tree-con"></div>'
			        +'</div>',
				backdropOpacity:0.7,
			    title: 'message',
				content: '<div class="right-tree">'
						+'	<div class="right-upload">'
		    			+'		<table>'
		    			+'			<tbody>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">*</span><span>题目：</span></td>'
		    			+'					<td>'
		    			+'						<div class="right-query-input right-upload-input03">'
						+'		                	<input type="text" name="" id="" placeholder="潘潘"/>'
						+'		                </div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">&nbsp;</span><span>类型：</span></td>'
		    			+'					<td>'
		    			+'						<div class="select-area">'
						+'		                    <div class="select-area-con">'
						+'		                        <input type="text" name="" id="" placeholder="请选择">'
						+'		                        <span class="select-btn"></span>'
						+'		                        <div class="select-list none btnone">'
						+'		                            <ul class="clearfix">'
						+'		                                <li><a href="#" xvalue="111">111111</a></li>'
						+'		                                <li><a href="#" xvalue="222">111111</a></li>'
						+'		                            </ul>'
						+'		                        </div>'
						+'		                    </div>'
						+'		                </div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">*</span><span>附件：</span></td>'
		    			+'					<td>'
		    			+'						<div class="right-upload-attachment-now ">'
		    			+'							<span class="color06">附件链接</span>'
		    			+'						</div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"></td>'
		    			+'					<td>'
		    			+'						<div class="right-upload-attachment">'
					    +'                            <a href="#" class="btn-upfile"><span>重新上传附件</span><input type="file" class="inp-file" id="inpFile"></a>'
					    +'                     </div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">*</span><span>答案解析：</span></td>'
		    			+'					<td>'
		    			+'						<div class="right-upload-text-area">'
		    			+'							<textarea name="" rows="5"></textarea>'
		    			+'						</div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">&nbsp;</span><span>知识点：</span></td>'
		    			+'					<td>'
		    			+'						<div class="right-query-input right-upload-input03">'
						+'		                	<input type="text" name="" id="" placeholder="潘潘"/>'
						+'		                </div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'			</tbody>'
		    			+'		</table>'
		    			+'	</div>'
						+'</div>'
						+'<div class="tree-btn">'
						+	'<div class="tree-btn-con clearfix">'
						+		'<span class="tree-btn-left fl">确认</span>'
						+		'<span class="tree-btn-right fr">取消</span>'
						+	'</div>'
						+'</div>'
			});
			addTable.showModal();
			Base.select(".select-btn",".select-area",".select-list");
			var trHtml = '<tr class="right-ques-options">'
						+'	  <td><span class="right-ques-option" serNum="0">A</span><span class="right-ques-span" title="应该具备哪些素质">应该具备哪些素质</span></td>'
						+'	  <td><span class="right-ques-span" title="单选">单选</span></td>'
						+'	  <td><span class="right-ques-span" title="B">B</span></td>'
						+'	  <td><a href="#" class="right-ques-span color06" title="附件链接">附件链接</a></td>'
						+'	  <td><span class="right-ques-span" title="答案解析答案解析">答案解析...</span></td>'
						+'	  <td><span class="right-ques-span" title="10">10</span></td>'
						+'	  <td><span class="right-ques-span" title="知识点知识点知识点知识点">知识点</span></td>'
						+'	  <td>'
						+'	      <div class="right-ques-meun">'
						+'			  <a href="###" class="right-ques-add">添加</a>'
						+'			  <a href="###" class="right-ques-edit">编辑</a>'
						+'			  <a href="###" class="right-ques-del">删除</a>'
						+'			  <a href="###" class="right-ques-online">上线</a>'
						+'		  </div>'
						+'	</td>'
						+'</tr>';
			var tdParent = $(this).parents(".right-ques-tbody"),
				tdSubmit = $(".tree-btn-left");
			tdSubmit.click(function() {
				addTable.close();
				tdParent.append(trHtml);
			});
			
		});
		quesTbody.on("click",".right-ques-name .right-ques-del",function() {
			if(confirm("是否删除该题的所有选项？")){
				$(this).parents(".right-ques-tbody").find(".right-ques-options").remove();
			}
		});
		quesTbody.on("click",".right-ques-name .right-ques-edit",function() {
			var tdParent = $(this).parents(".right-ques-name"),
				quesSpanAll =  tdParent.find(".right-ques-span");
				quesTitle = quesSpanAll.eq(0).attr("title"),
				quesType = quesSpanAll.eq(1).attr("title"),
				quesAnswer = quesSpanAll.eq(2).attr("title"),
				quesAttachment = quesSpanAll.eq(3).attr("title"),
				quesAnswerAll = quesSpanAll.eq(4).attr("title"),
				quesKnowledge = quesSpanAll.eq(6).attr("title");
			var editTable = dialog({
				innerHTML:
			        '<div i="dialog" class="ui-dialog">'
			        +  '<div class="alt-area-title"><span>添加选项</span><button i="close" class="ui-dialog-close alt-cls"></button></div>'
			        +  '<div i="content" class="ui-dialog-content alt-tree-con"></div>'
			        +'</div>',
				backdropOpacity:0.7,
			    title: 'message',
				content: '<div class="right-tree">'
						+'	<div class="right-upload">'
		    			+'		<table>'
		    			+'			<tbody>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">*</span><span>题目：</span></td>'
		    			+'					<td>'
		    			+'						<div class="right-query-input right-upload-input03">'
						+'		                	<input type="text" name="" id="" placeholder="潘潘" val="'+quesTitle+'"/>'
						+'		                </div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">&nbsp;</span><span>类型：</span></td>'
		    			+'					<td>'
		    			+'						<div class="select-area">'
						+'		                    <div class="select-area-con">'
						+'		                        <input type="text" name="" id="" placeholder="请选择">'
						+'		                        <span class="select-btn"></span>'
						+'		                        <div class="select-list none btnone">'
						+'		                            <ul class="clearfix">'
						+'		                                <li><a href="#" xvalue="111">111111</a></li>'
						+'		                                <li><a href="#" xvalue="222">111111</a></li>'
						+'		                            </ul>'
						+'		                        </div>'
						+'		                    </div>'
						+'		                </div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">*</span><span>附件：</span></td>'
		    			+'					<td>'
		    			+'						<div class="right-upload-attachment-now ">'
		    			+'							<span class="color06">附件链接</span>'
		    			+'						</div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"></td>'
		    			+'					<td>'
		    			+'						<div class="right-upload-attachment">'
					    +'                            <a href="#" class="btn-upfile"><span>重新上传附件</span><input type="file" class="inp-file" id="inpFile"></a>'
					    +'                     </div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">*</span><span>答案解析：</span></td>'
		    			+'					<td>'
		    			+'						<div class="right-upload-text-area">'
		    			+'							<textarea name="" rows="5"></textarea>'
		    			+'						</div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'				<tr>'
		    			+'					<td class="right-upload-td-left"><span class="color01">&nbsp;</span><span>知识点：</span></td>'
		    			+'					<td>'
		    			+'						<div class="right-query-input right-upload-input03">'
						+'		                	<input type="text" name="" id="" placeholder="潘潘" value="'+quesAnswerAll+'"/>'
						+'		                </div>'
		    			+'					</td>'
		    			+'				</tr>'
		    			+'			</tbody>'
		    			+'		</table>'
		    			+'	</div>'
						+'</div>'
						+'<div class="tree-btn">'
						+	'<div class="tree-btn-con clearfix">'
						+		'<span class="tree-btn-left fl">确认</span>'
						+		'<span class="tree-btn-right fr">取消</span>'
						+	'</div>'
						+'</div>'
			});
			editTable.showModal();
			Base.select(".select-btn",".select-area",".select-list");
			var	tdSubmit = $(".tree-btn-left");
			tdSubmit.click(function() {
				quesSpanAll.eq(0).attr("title","111").html("111");
				quesSpanAll.eq(1).attr("title","222").html("222");
				quesSpanAll.eq(2).attr("title","333").html("333");
				quesSpanAll.eq(3).attr("title","444").html("444");
				quesSpanAll.eq(4).attr("title","555").html("555");
				quesSpanAll.eq(5).attr("title","666").html("666");
				editTable.close();
			});
		});
			
	};
	//弹层--选择教师
	Alt.showTechter= function() {
		var altTech = $(".right-upload-red");
		altTech.on("click",function() {
			var optCheck = '<span class="tech-check">10086</span>';
			optCheck = optCheck + optCheck + optCheck + optCheck + optCheck + optCheck + optCheck + optCheck + optCheck + optCheck + optCheck + optCheck + optCheck;
			var optHtml = '	<div class="alt-tech-option">'
						+'		<div class="check-area fl">'
						+'	    	<span class="checks"></span>'
						+'	    </div>'
						+'	    <span class="alt-thec-span">10086</span>'
						+'	</div>';
				optHtml = optHtml + optHtml + optHtml + optHtml + optHtml + optHtml + optHtml + optHtml + optHtml + optHtml + optHtml + optHtml + optHtml + optHtml;
			var viewHtml = '<div class="alt-tech-name clearfix">'+optCheck+'</div>'
						+'	<div class="alt-tech-input">'
						+'		<input type="text" />'
						+'		<span>搜索</span>'
						+'	</div>'
						+'	<div class="alt-tech-con">'
						+		optHtml
						+'	</div>';
			var dThecter = dialog({
				innerHTML:
			        '<div i="dialog" class="ui-dialog">'
			        +  '<div class="alt-area-title"><span>选择讲师(最多5个)</span><button i="close" class="ui-dialog-close alt-cls"></button></div>'
			        +  '<div i="content" class="ui-dialog-content alt-tree-con"></div>'
			        +'</div>',
				backdropOpacity:0.7,
			    title: 'message',
				content: '<div class="alt-tech-all">'
						+	viewHtml
						+'</div>'
						
			});
			dThecter.showModal();
			Base.check(".checks");
			$('.alt-tech-name').perfectScrollbar();
			$('.alt-tech-con').perfectScrollbar();
		});
	};
	//	弹层--选择收件人
	Alt.choseMess = function() {
		
	}
});
function test() {
	alert(123456);
	console.log("123");
}
function test() {
	alert(123456)
}