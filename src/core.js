﻿//===========================================
//  J+ Library   0.1
//===========================================


//  可用的宏     
// SupportIE10 - 支持 IE10+ FF5+ Chrome12+ Opera12+ Safari6+ 。
// SupportIE9 - 支持 IE9+ FF4+ Chrome10+ Opera10+ Safari4+ 。
// SupportIE8  -   支持 IE8+ FF3+ Chrome10+ Opera10+ Safari4+ 。
// SupportIE6   -  支持 IE6+ FF2.5+ Chrome1+ Opera9+ Safari4+ 。
// SupportUsing - 支持 namespace 等。
// Compact - 当前执行了打包操作。
// Debug - 启用调试， 启用调试将执行 assert 函数。



/// #ifndef Compact

 
// 配置。可以删除以下代码。

/**
 * @type Object
 */
var JPlus = {
	
	/**
	 * 是否打开调试。
	 * @config {Boolean}
	 */
	debug: true,
	
	/**
	 * 启用控制台调试。
	 * @config {Boolean} 
	 * 如果不存在控制台，将自动调整为 false 。
	 */
	trace: true,

	/**
	 * 根目录。(需要末尾追加 /)
	 * @config {String}
	 * 程序会自动搜索当前脚本的位置为跟目录。
	 */
	rootPath: undefined,
	
	/**
	 * 是否输出 assert 来源。
	 * @config {Boolean}
	 * @value false
	 * 如果此项是 true， 将会输出 assert 失败时的来源函数。
	 */
	stackTrace: false,
	
	/**
	 * 默认的全局名字空间。
	 * @config {Object}
	 * @value window
	 */
	defaultNamespace: 'JPlus',
	
	/**
	 * 如果使用了 UI 库，则 theme 表示默认主题。
	 * @config {String}
	 * @value 'default'
	 */
	theme: 'default',
	
	/**
	 * 如果使用了 UI 库，则  resource 表示公共的主题资源。
	 * @config {String}
	 * @value 'share'
	 */
	resource: 'share'

};




/// #endif

//===========================================
//  核心。定义必须的系统函数。
//===========================================

/**
 * @projectDescription JPlus
 * @copyright 2011 JPlus Team
 * @fileOverview 系统核心的核心部分。
 */






(function (window) {
	
	/// #define JPlus
	
	/// #ifndef Debug
	/// #define assert
	/// #define trace
	/// #endif
	
	/// #if defined(SupportIE7) && !defined(SupportIE6)
	/// #define SupportIE6
	/// #endif
	
	/// #if !defined(SupportIE9) && !defined(SupportIE8) && !defined(SupportIE6)
	/// #define SupportIE6
	/// #endif
	
	/// #ifdef SupportIE6
	/// #define SupportIE8
	/// #endif
	
	/// #ifdef SupportIE8
	/// #define SupportIE9
	/// #endif
	
	/// #ifndef Compact
	/// #define SupportUsing
	/// #endif
	
	/// #ifndef SupportUsing
	/// #define using
	/// #endif

	/// #region 全局变量
	
	/**
	 * document 简写。
	 * @type Document
	 */
	var document = window.document,
		
		/**
		 * navigator 简写。
		 * @type Navigator
		 */
		navigator = window.navigator,
		
		/**
		 * Array.prototype  简写。
		 * @type Object
		 */
		ap = Array.prototype,
		
		/**
		 * Object  简写。
		 * @type Function
		 */
		o = window.Object,
	
		/**
		 * Object.prototype.toString 简写。
		 * @type Function
		 */
		toString = o.prototype.toString,
		
		/**
		 * Object.prototype.hasOwnProperty 简写。
		 * @type Function
		 */
		hasOwnProperty = o.prototype.hasOwnProperty,
		
		/**
		 * 检查空白的正则表达式。
		 * @type RegExp
		 */
		rSpace = /^[\s\u00A0]+|[\s\u00A0]+$/g,
		
		/**
		 * 格式化字符串用的正则表达式。
		 * @type RegExp
		 */
		rFormat = /\{+?(\S*?)\}+/g,
		
		/**
		 * 查找字符点的正则表达式。
		 * @type RegExp
		 */
		rPoint = /\./g,
		
		/**
		 * 匹配第一个字符。
		 * @type RegExp
		 */
		rFirstChar = /(\b[a-z])/g,
		
		/**
		 * 表示空白字符。
		 * @type RegExp
		 */
		rWhite = /%20/g,
		
		/**
	     * 转为骆驼格式的正则表达式。
	     * @type RegExp
	     */
		rToCamelCase = /-(\w)/g,
		
		/**
		 * 管理所有事件类型的工具。
		 * @type Object
		 */
		eventMgr = {
			
			/**
			 * 管理默认的类事件。
			 * @type Object
			 */
			$default: {
				add: emptyFn,
				initEvent: emptyFn,
				remove: emptyFn
			}
			
		},

		/**
		 * Py静态对象。
		 * @namespace JPlus
		 */
		p = namespace('JPlus.', {
			
			/**
			 * 获取属于一个元素的数据。
			 * @param {Object} obj 元素。
			 * @param {String} dataType 类型。
			 * @return {Object} 值。
			 * 这个函数会在对象内生成一个 data 字段， 并生成一个 data.dataType 对象返回。
			 * 如果原先存在 data.dataType, 则直接返回。
			 * @example
			 * <code>
			 * var obj = {};
			 * JPlus.data(obj, 'a').c = 2;
			 * trace(  JPlus.data(obj, 'a').c  ) // 2
			 * </code>
			 */
			data: function (obj, dataType) {
				
				assert.isObject(obj, "JPlus.data(obj, dataType): 参数 {obj} ~。");
				
				// 创建或获取 '$data'。
				var d = obj.$data || (obj.$data = {}) ;
				
				// 创建或获取 dataType。
				return d[dataType] || (d[dataType] = {});
			},
		
			/**
			 * 如果存在，获取属于一个元素的数据。
			 * @param {Object} obj 元素。
			 * @param {String} dataType 类型。
			 * @return {Object} 值。
			 * 这个函数会在对象内生成一个 data 字段， 并生成一个 data.dataType 对象返回。
			 * 如果原先存在 data.dataType, 则直接返回。
			 * @example
			 * <code>
			 * var obj = {};
			 * if(JPlus.getData(obj, 'a')) // 如果存在 a 属性。 
			 *     trace(  JPlus.data(obj, 'a')  )
			 * </code>
			 */
			getData:function (obj, dataType) {
				
				assert.isObject(obj, "JPlus.getData(obj, dataType): 参数 {obj} ~。");
				
				// 获取属性'$data'。
				var d = obj.$data;
				return d && d[dataType];
			},
			
			/**
			 * 设置属于一个元素的数据。
			 * @param {Object} obj 元素。
			 * @param {String} dataType 类型。
			 * @param {Object} data 内容。
			 * @return data
			 * @example
			 * <code>
			 * var obj = {};
			 * JPlus.setData(obj, 'a', 5);    //     5
			 * </code>
			 */
			setData: function (obj, dataType, data) {
				
				assert.isObject(obj, "JPlus.setData(obj, dataType): 参数 {obj} ~。");
				
				// 简单设置变量。
				return (obj.$data || (obj.$data = {}))[dataType] = data;
			},
			
			/**
			 * 复制一个对象的事件拷贝到另一个对象。
			 * @param {Object} src 来源的对象。
			 * @param {Object} dest 目标的对象。
			 * @return this
			 */
			cloneEvent: function (src, dest) {
				
				assert.isObject(src, "JPlus.cloneEvent(src, dest): 参数 {src} ~。");
				assert.isObject(dest, "JPlus.cloneEvent(src, dest): 参数 {dest} ~。");
				
				// event 作为系统内部对象。事件的拷贝必须重新进行 on 绑定。
				var eventName = src.$data, event = eventName && eventName.event;
				
				if(event)
					for (eventName in event)
					
						// 对每种事件。
						event[eventName].handlers.forEach(function (handler) {
							
							// 如果源数据的 target 是 src， 则改 dest 。
							p.IEvent.on.call(dest, eventName, handler[0], handler[1] === src ? dest : handler[1]);
						});
			}, 
			
			/**
			 * 创建一个类。
			 * @param {Object/Function} [methods] 成员或构造函数。
			 * @return {Class} 生成的类。
			 * 创建一个类，相当于继承于 JPlus.Object创建。
			 * @see JPlus.Object.extend
			 * @example
			 * <code>
			 * var MyCls = Class({
			 * 
			 *    constructor: function (g, h) {
			 * 	      alert('构造函数' + g + h)
			 *    }	
			 * 
			 * });
			 * 
			 * 
			 * var c = new MyCls(4, ' g');
			 * </code>
			 */
			Class: function (members) {
					
				// 创建类，其实就是 继承 Object ，创建一个类。
				return Object.extend(members);
			},
			
			/**
			 * 所有类的基类。
			 * @class JPlus.Object
			 */
			Object: Object,
			
			/**
			 * 由存在的类修改创建类。
			 * @param {Function/Class} constructor 将创建的类。
			 * @return {Class} 生成的类。
			 */
			Native: function (constructor) {
				
				// 简单拷贝  Object 的成员，即拥有类的特性。
				// 在 JavaScript， 一切函数都可作为类，故此函数存在。
				// Object 的成员一般对当前类构造函数原型辅助。
				return applyIf(constructor, Object);
			},
			
			/// #ifdef SupportUsing
		
			/**
			 * 全部已载入的名字空间。
			 * @type Array
			 * @private
			 */
			namespaces: [],
			
			/**
			 * 同步载入代码。
			 * @param {String} uri 地址。
			 * @example
			 * <code>
			 * JPlus.loadScript('./v.js');
			 * </code>
			 */
			loadScript: function (url) {
				return p.loadText(url, execScript);
			},
			
			/**
			 * 异步载入样式。
			 * @param {String} uri 地址。
			 * @example
			 * <code>
			 * JPlus.loadStyle('./v.css');
			 * </code>
			 */
			loadStyle: function (url) {
				
				// 在顶部插入一个css，但这样肯能导致css没加载就执行 js 。所以，要保证样式加载后才能继续执行计算。
				return document.getElementsByTagName("HEAD")[0].appendChild(apply(document.createElement('link'), {
					href: url,
					rel: 'stylesheet',
					type: 'text/css'
				}));
			},
			
			/**
			 * 同步载入文本。
			 * @param {String} uri 地址。
			 * @param {Function} [callback] 对返回值的处理函数。
			 * @return {String} 载入的值。
			 * 因为同步，所以无法跨站。
			 * @example
			 * <code>
			 * trace(  JPlus.loadText('./v.html')  );
			 * </code>
			 */
			loadText: function (url, callback) {
				
				assert.notNull(url, "JPlus.loadText(url, callback): 参数 {url} ~。");
	
				//     assert(window.location.protocol != "file:", "JPlus.loadText(uri, callback):  当前正使用 file 协议，请使用 http 协议。 \r\n请求地址: {0}",  uri);
				
				// 新建请求。
				// 下文对 XMLHttpRequest 对象进行兼容处理。
				var xmlHttp = new XMLHttpRequest();
				
				try {
					
					// 打开请求。
					xmlHttp.open("GET", url, false);
	
					// 发送请求。
					xmlHttp.send(null);

					// 检查当前的 XMLHttp 是否正常回复。
					if (!p.checkStatusCode(xmlHttp.status)) {
						//载入失败的处理。
						throw String.format("请求失败:  \r\n   地址: {0} \r\n   状态: {1}   {2}  {3}", url, xmlHttp.status, xmlHttp.statusText, window.location.protocol == "file:" ? '\r\n原因: 当前正使用 file 协议打开文件，请使用 http 协议。' : '');
					}
					
					url = xmlHttp.responseText;
					
					// 运行处理函数。
					return callback ? callback(url) : url;
	
				} catch(e) {
					
					// 调试输出。
					trace.error(e);
				} finally{
					
					// 释放资源。
					xmlHttp = null;
				}
	
			},
	
			/**
			 * 使用一个名空间。
			 * @param {String} ns 名字空间。
			 * @param {Boolean} isStyle=false 是否为样式表。
			 * 有关名字空间的说明， 见 {@link namespace} 。
			 * @example
			 * <code>
			 * using("System.Dom.Keys");
			 * </code>
			 */
			using: function (ns, isStyle) {
				
				assert.isString(ns, "using(ns): 参数 {ns} 不是合法的名字空间。");
				
				// 已经载入。
				if(p.namespaces.include(ns))
					return;
				
				// 如果名字空间本来就是一个地址，则不需要转换，否则，将 . 替换为 / ,并在末尾加上 文件后缀。
				if(ns.indexOf('/') === -1) {
					ns = ns.toLowerCase().replace(rPoint, '/') + (isStyle ? '.css' : '.js');
				}
				 
				 var doms, check, callback;
				 
				 if(isStyle) {
				 	callback = p.loadStyle;
				 	doms = document.styleSheets;
					src = 'href';
				 } else {
				 	callback = p.loadScript;
				 	doms = document.getElementsByTagName("SCRIPT");
					src = 'src';
				 }
				 
				 // 如果在节点找到符合的就返回，找不到，调用 callback 进行真正的 加载处理。
				 each.call(doms, function (dom) {
				 	return !dom[src] || dom[src].toLowerCase().indexOf(ns) === -1;
				 }) && callback(p.rootPath + ns);
			},
			
			/// #endif
	
			/**
			 * 定义名字空间。
			 * @param {String} name 名字空间。
			 * @param {Object} [obj] 值。
			 * <p>
			 * 名字空间是项目中表示资源的符合。
			 * </p>
			 * 
			 * <p>
			 * 比如  system/dom/keys.js 文件， 名字空间是 System.Dom.Keys
			 * 名字空间用来快速表示资源。 {@link using} 和  {@link imports} 可以根据制定的名字空间载入相应的内容。
			 * </p>
			 * 
			 * <p>
			 * namespace 函数有多个重载， 如果只有1个参数:
			 * <code>
			 * namespace("System.Dom.Keys"); 
			 * </code>
			 * 表示系统已经载入了这个名字空间的资源， using 和 imports 将忽视这个资源的载入。
			 * </p>
			 * 
			 * <p>
			 * namespace 如果有2个参数， 表示在指定的位置创建对象。
			 * <code>
			 * namespace("A.B.C", 5); // 最后 A = {B: {C: 5}}  
			 * </code>
			 * 这个写法最后覆盖了 C 的值，但不影响 A 和 B。 
			 * 
			 * <p>
			 * 如果这个名字空间的首字符是 . 则系统会补上 'JPlus'
			 * </p> 
			 * 
			 * <p>
			 * 如果这个名字空间的最后的字符是 . 则系统不会覆盖已有对象，而是复制成员到存在的成员。
			 * </p> 
			 * 
			 * </p>
			 * 
			 * @example
			 * <code>
			 * namespace("System.Dom.Keys");  // 避免 重新去引入   System.Dom.Keys
			 * 
			 * var A = {   B:  {b: 5},  C: {b: 5}    };
			 * namespace("A.B", {a: 6})  // A = { B: {a: 6}, C: {b: 5}  }
			 * 
			 * var A = {   B:  {b: 5},  C: {b: 5}    };
			 * namespace("A.C.", {a: 6})  // A = { B: {b: 5},  C: {a: 6, b: 5} }
			 * 
			 * namespace(".G", 4);    // JPlus.G = G  = 4
			 * </code>
			 */
			namespace: namespace,
			
			/**
			 * 判断一个状态码是否为正确的返回。
			 * @param {Number} statusCode 请求。
			 * @return {Boolean} 正常返回true 。
			 */
			checkStatusCode: function (statusCode) {
				
				// 获取状态。
				if (!statusCode) {
					
					// 获取协议。
					var protocol = window.location.protocol;
					
					// 对谷歌浏览器, 在有些协议，  statusCode 不存在。
					return (protocol == "file: " || protocol == "chrome: " || protocol == "app: ");
				}
				
				// 检查， 各浏览器支持不同。
				return (statusCode >= 200 && statusCode < 300) || statusCode == 304 || statusCode == 1223;
			},
	
			/**
			 * 默认的全局名字空间。
			 * @config {Object}
			 * @value window
			 */
			defaultNamespace: 'JPlus',
			
			/**
			 * 管理所有事件类型的工具。
			 * @property
			 * @type Object
			 * @private
			 * 所有类的事件信息存储在这个变量。使用 xType -> name的结构。
			 */
			Events: eventMgr, 
			
			/**
			 * 表示一个事件接口。
			 * @interface
			 * @singleton
			 * JPlus.IEvent 提供了事件机制的基本接口，凡实现这个接口的类店都有事件的处理能力。
			 * 在调用  {@link JPlus.Object.addEvents} 的时候，将自动实现这个接口。
			 */
			IEvent: {
			
				/**
				 * 增加一个监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} listener 调用函数。
				 * @param {Object} bind=this listener 执行时的作用域。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.on('click', function (e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				on: function (type, listener, bind) {
					
					assert.isFunction(listener, 'IEvent.on(type, listener, bind): 参数 {listener} ~。');
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.data(me, 'event'), evt = d[type];
					
					// 如果未绑定过这个事件。
					if (!evt) {
						
						// 支持自定义安装。
						d[type] = evt = function (e) {
							var listener = arguments.callee,
								handlers = listener.handlers.slice(0), 
								i = -1,
								len = handlers.length;
							
							// 循环直到 return false。 
							while (++i < len) 
								if (handlers[i][0].call(handlers[i][1], e) === false) 										
									return false;
							
							return true;
						};
						
						// 获取事件管理对象。 
						d = getMgr(me, type);
						
						// 当前事件的全部函数。
						evt.handlers = [[d.initEvent, me]];
						
						// 添加事件。
						d.add(me, type, evt);
						
					}
					
					// 添加到 handlers 。
					evt.handlers.push([listener, bind || me]);
						
					return me;
				},
				
				/**
				 * 删除一个监听器。
				 * @param {String} [type] 监听名字。
				 * @param {Function} [listener] 回调器。
				 * @return Object this
				 * 注意: function () {} !== function () {}, 这意味着这个代码有问题:
				 * <code>
				 * elem.on('click', function () {});
				 * elem.un('click', function () {});
				 * </code>
				 * 你应该把函数保存起来。
				 * <code>
				 * var c =  function () {};
				 * elem.on('click', c);
				 * elem.un('click', c);
				 * </code>
				 * @example
				 * <code>
				 * elem.un('click', function (e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				un: function (type, listener) {
					
					assert(!listener || Function.isFunction(listener), 'IEvent.un(type, listener): 参数 {listener} 必须是函数或空参数。', listener);
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.getData(me, 'event'), evt, handlers, i;
					if (d) {
						 if (evt = d[type]) {
						 	
						 	handlers = evt.handlers;
						 	
							if (listener) {
								
								// 搜索符合的句柄。
								for(i = handlers.length - 1; i; i--) {
									if(handlers[i][0] === listener)	{
										handlers.splice(i, 1);
										break;
									}
								} 
								
							}
								
							// 检查是否存在其它函数或没设置删除的函数。
							if (!listener || handlers.length < 2) {
								
								// 删除对事件处理句柄的全部引用，以允许内容回收。
								delete d[type];
								
								// 内部事件管理的删除。
								getMgr(me, type).remove(me, type, evt);
							}
						}else if (!type) {
							for (evt in d) 
								me.un(evt);
						}
					}
					return me;
				},
				
				/**
				 * 触发一个监听器。
				 * @param {String} type 监听名字。
				 * @param {Object} [e] 事件参数。
				 * @return Object this
				 * trigger 只是手动触发绑定的事件。
				 * @example
				 * <code>
				 * elem.trigger('click');
				 * </code>
				 */
				trigger: function (type, e) {
					
					// 获取本对象     本对象的数据内容   本事件值 。
					var me = this, evt = p.getData(me, 'event'), eMgr;
					
					// 执行事件。
					return !evt || !(evt = evt[type]) || ((eMgr = getMgr(me, type)).trigger ? eMgr.trigger(me, type, evt, e) : evt(e) );
					
				},
				
				/**
				 * 增加一个只执行一次的监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} listener 调用函数。
				 * @param {Object} bind=this listener 执行时的作用域。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.one('click', function (e) {
				 * 		trace('a');  
				 * });
				 * 
				 * elem.trigger('click');   //  输出  a
				 * elem.trigger('click');   //  没有输出 
				 * </code>
				 */
				one: function (type, listener, bind) {
					
					assert.isFunction(listener, 'IEvent.one(type, listener): 参数 {listener} ~。');
					
					// one 本质上是 on ,  只是自动为 listener 执行 un 。
					return this.on(type, function () {
						
						// 删除，避免闭包。
						this.un( type, arguments.callee);
						
						// 然后调用。
						return listener.apply(this, arguments);
					}, bind);
				}
				
				
			}
			
		});
	
	/// #endregion
		
	/// #region 全局函数
	
	/**
	 * @namespace JPlus.Object
	 */
	apply(Object, {
	
		/**
		 * 扩展当前类的动态方法。
		 * @param {Object} members 成员。
		 * @return this
		 * @seeAlso JPlus.Object.implementIf
		 * @example
		 * <code>
		 * Number.implement({
		 *   sin: function () {
		 * 	    return Math.sin(this);
		 *  }
		 * });
		 * 
		 * (1).sin();  //  Math.sin(1);
		 * </code>
		 */
		implement: function (members) {

			assert(members && this.prototype, "Class.implement(members): 无法扩展类，因为 {members} 或 this.prototype 为空。", members);
			// 复制到原型 。
			o.extend(this.prototype, members);
	        
			return this;
		},
		
		/**
		 * 如果不存在成员, 扩展当前类的动态方法。
		 * @param {Object} members 成员。
		 * @return this
		 * @seeAlso JPlus.Object.implement
		 */
		implementIf: function (members) {
		
			assert(members && this.prototype, "Class.implementIf(members): 无法扩展类，因为 {members} 或 this.prototype 为空。", members);
	
			applyIf(this.prototype, members);
			
			return this;
		},
		
		/**
		 * 为当前类添加事件。
		 * @param {Object} [evens] 所有事件。 具体见下。
		 * @return this
		 * <p>
		 * 由于一个类的事件是按照 xType 属性存放的，拥有相同  xType 的类将有相同的事件，为了避免没有 xType 属性的类出现事件冲突， 这个方法会自动补全  xType 属性。
		 * </p>
		 * 
		 * <p>
		 * 这个函数是实现自定义事件的关键。
		 * </p>
		 * 
		 * <p>
		 * addEvents 函数的参数是一个事件信息，格式如:  {click: { add: ..., remove: ..., initEvent: ..., trigger: ...} 。
		 * 其中 click 表示事件名。一般建议事件名是小写的。
		 * </p>
		 * 
		 * <p>
		 * 一个事件有多个相应，分别是: 绑定(add), 删除(remove), 触发(trigger), 初始化事件参数(initEvent)
		 * </p>
		 * 
		 * </p>
		 * 当用户使用   o.on('事件名', 函数)  时， 系统会判断这个事件是否已经绑定过，
		 * 如果之前未绑定事件，则会创建新的函数 evtTrigger，
		 * evtTrigger 函数将遍历并执行 evtTrigger.handlers 里的成员, 如果其中一个函数执行后返回 false， 则中止执行，并返回 false， 否则返回 true。
		 * evtTrigger.handlers 表示 当前这个事件的所有实际调用的函数的数组。 evtTrigger.handlers[0] 是事件的 initEvent 函数。
		 * 然后系统会调用 add(o, '事件名', evtTrigger)
		 * 然后把 evtTrigger 保存在 o.data.event['事件名'] 中。
		 * 如果 之前已经绑定了这个事件，则 evtTrigger 已存在，无需创建。
		 * 这时系统只需把 函数 放到 evtTrigger.handlers 即可。
		 * </p>
		 * 
		 * <p>
		 * 也就是说，真正的事件触发函数是 evtTrigger， evtTrigger去执行用户定义的一个事件全部函数。
		 * </p>
		 * 
		 * <p>
		 * 当用户使用  o.un('事件名', 函数)  时， 系统会找到相应 evtTrigger， 并从
		 * evtTrigger.handlers 删除 函数。
		 * 如果  evtTrigger.handlers 是空数组， 则使用
		 * remove(o, '事件名', evtTrigger)  移除事件。
		 * </p>
		 * 
		 * <p>
		 * 当用户使用  o.trigger(参数)  时， 系统会找到相应 evtTrigger， 
		 * 如果事件有trigger， 则使用 trigger(对象, '事件名', evtTrigger, 参数) 触发事件。
		 * 如果没有， 则直接调用 evtTrigger(参数)。
		 * </p>
		 * 
		 * <p>
		 * 下面分别介绍各函数的具体内容。
		 * </p>
		 * 
		 * <p>
		 * add 表示 事件被绑定时的操作。  原型为: 
		 * </p>
		 * 
		 * <code>
		 * function add(elem, type, fn) {
		 * 	   // 对于标准的 DOM 事件， 它会调用 elem.addEventListener(type, fn, false);
		 * }
		 * </code>
		 * 
		 * <p>
		 *  elem表示绑定事件的对象，即类实例。 type 是事件类型， 它就是事件名，因为多个事件的 add 函数肯能一样的， 因此 type 是区分事件类型的关键。fn 则是绑定事件的函数。
		 * </p>
		 * 
		 * <p>
		 * remove 同理。
		 * </p>
		 * 
		 * <p>
		 * initEvent 的参数是一个事件参数，它只能有1个参数。
		 * </p>
		 * 
		 * <p>
		 * trigger 是高级的事件。参考上面的说明。 
		 * </p>
		 * 
		 * <p>
		 * 如果你不知道其中的几个参数功能，特别是  trigger ，请不要自定义。
		 * </p>
		 * 
		 * @example
		 * 下面代码演示了如何给一个类自定义事件，并创建类的实例，然后绑定触发这个事件。
		 * <code>
		 * 
		 * // 创建一个新的类。
		 * var MyCls = new Class();
		 * 
		 * MyCls.addEvents({
		 * 
		 *     click: {
		 * 			
		 * 			add:  function (elem, type, fn) {
		 * 	   			alert("为  elem 绑定 事件 " + type );
		 * 			},
		 * 
		 * 			initEvent: function (e) {
		 * 	   			alert("初始化 事件参数  " + e );
		 * 			}
		 * 
		 * 		}
		 * 
		 * });
		 * 
		 * var m = new MyCls;
		 * m.on('click', function () {
		 * 	  alert(' 事件 触发 ');
		 * });
		 * 
		 * m.trigger('click', 2);
		 * 
		 * </code>
		 */
		addEvents: function (events) {
			
			var ep = this.prototype;
			
			assert(!events || o.isObject(events), "Class.addEvents(events): 参数 {event} 必须是一个包含事件的对象。 如 {click: { add: ..., remove: ..., initEvent: ..., trigger: ... } ", events);
			
			// 实现 事件 接口。
			applyIf(ep, p.IEvent);
			
			// 如果有自定义事件，则添加。
			if (events) {
				
				var xType = hasOwnProperty.call(ep, 'xType') ? ep.xType : ( ep.xType = (p.id++).toString() );
				
				// 更新事件对象。
				o.update(events, function (e) {
					return applyIf(e, eventMgr.$default);
					
					// 添加 JPlus.Events 中事件。
				}, eventMgr[xType] || (eventMgr[xType] = {}));
			
			}
			
			
			return this;	
		},
	
		/**
		 * 继承当前类并返回子类。
		 * @param {Object/Function} [methods] 成员或构造函数。
		 * @return {Class} 继承的子类。
		 * <p>
		 * 这个函数是实现继承的核心。
		 * </p>
		 * 
		 * <p>
		 * 在 Javascript 中，继承是依靠原型链实现的， 这个函数仅仅是对它的包装，而没有做额外的动作。
		 * </p>
		 * 
		 * <p>
		 * 成员中的  constructor 成员 被认为是构造函数。
		 * </p>
		 * 
		 * <p>
		 * 这个函数实现的是 单继承。如果子类有定义构造函数，则仅调用子类的构造函数，否则调用父类的构造函数。
		 * </p>
		 * 
		 * <p>
		 * 要想在子类的构造函数调用父类的构造函数，可以使用  {@link JPlus.Object.prototype.base} 。
		 * </p>
		 * 
		 * <p>
		 * 这个函数返回的类实际是一个函数，但它被使用 JPlus.Object 修饰过。
		 * </p>
		 * 
		 * <p>
		 * 由于原型链的关系， 肯能存在共享的引用。
		 * 
		 * 如: 类 A ，  A.prototype.c = [];
		 * 
		 * 那么，A的实例 b , d 都有 c 成员， 但它们共享一个   A.prototype.c 成员。
		 * 
		 * 这显然是不正确的。所以你应该把 参数 quick 置为 false ， 这样， A创建实例的时候，会自动解除共享的引用成员。
		 * 
		 * 当然，这是一个比较费时的操作，因此，默认  quick 是 true 。
		 * </p>
		 * 
		 * <p>
		 * 你也可以把动态成员的定义放到 构造函数， 如: this.c = [];
		 * 
		 * 这是最好的解决方案。
		 * </p>
		 */
	 	extend: function (members) {
	
			// 未指定函数   使用默认构造函数(Object.prototype.constructor);
			
			// 生成子类 。
			var subClass = hasOwnProperty.call(members =  members instanceof Function ? {
					constructor: members
				} : (members || {}), "constructor") ? members.constructor : function () {
					
					// 调用父类构造函数 。
					arguments.callee.base.apply(this, arguments);
					
				};
				
			// 代理类 。
			emptyFn.prototype = (subClass.base = this).prototype;
			
			// 指定成员 。
			subClass.prototype = o.extend(new emptyFn, members);
			
			// 覆盖构造函数。
			subClass.prototype.constructor = subClass;

			// 指定Class内容 。
			return p.Native(subClass);

		}

	});
	
	/**
	 * Object  简写。
	 * @namespace Object
	 */
	apply(o, {

		/**
		 * 复制对象的所有属性到其它对象。 
		 * @param {Object} dest 复制目标。
		 * @param {Object} obj 要复制的内容。
		 * @return {Object} 复制后的对象 (dest)。
		 * @seeAlso Object.extendIf
		 * @example
		 * <code>
		 * var a = {v: 3}, b = {g: 2};
		 * Object.extend(a, b);
		 * trace(a); // {v: 3, g: 2}
		 * </code>
		 */
		extend: (function () {
			for (var item in {toString: true})
				return apply;
			
			p.enumerables = "toString hasOwnProperty valueOf constructor isPrototypeOf".split(' ');
			// IE6  不会遍历系统对象需要复制，所以强制去测试，如果改写就复制 。
			return function (dest, src) {
				if(src) {
					assert(dest != null, "Object.extend(dest, src): 参数 {dest} 不可为空。", dest);
					
					for (var i = p.enumerables.length, value; i--;)
						if(hasOwnProperty.call(src, value = p.enumerables[i]))
							dest[value] = src[value];
					apply(dest, src);
				}

				return dest;
			}
		})(),

		/**
		 * 如果目标成员不存在就复制对象的所有属性到其它对象。 
		 * @param {Object} dest 复制目标。
		 * @param {Object} obj 要复制的内容。
		 * @return {Object} 复制后的对象 (dest)。
		 * @seeAlso Object.extend
		 * <code>
		 * var a = {v: 3, g: 5}, b = {g: 2};
		 * Object.extendIf(a, b);
		 * trace(a); // {v: 3, g: 5}  b 未覆盖 a 任何成员。
		 * </code>
		 */
		extendIf: applyIf,
		
		/**
		 * 在一个可迭代对象上遍历。
		 * @param {Array/Object} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
	 	 * @param {Object} bind 函数执行时的作用域。
		 * @return {Boolean} 如果已经遍历完所传的所有值， 返回 true， 如果遍历被中断过，返回 false。
		 * @example
		 * <code> 
		 * Object.each({a: '1', c: '3'}, function (value, key) {
		 * 		trace(key + ' : ' + value);
		 * });
		 * // 输出 'a : 1' 'c : 3'
		 * </code>
		 */
		each: function (iterable, fn, bind) {

			assert(!Function.isFunction(iterable), "Object.each(iterable, fn, bind): 参数 {iterable} 不能是函数。 ", iterable);
			assert(Function.isFunction(fn), "Object.each(iterable, fn, bind): 参数 {fn} 必须是函数。 ", fn);
			
			// 如果 iterable 是 null， 无需遍历 。
			if (iterable != null) {
				
				//普通对象使用 for( in ) , 数组用 0 -> length  。
				if (iterable.length === undefined) {
					
					// Object 遍历。
					for (var t in iterable) 
						if (fn.call(bind, iterable[t], t, iterable) === false) 
							return false;
				} else {
					return each.call(iterable, fn, bind);
				}
				
			}
			
			// 正常结束。
			return true;
		},

		/**
		 * 更新一个可迭代对象。
		 * @param {Array/Object} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
	 	 * @param {Object} bind=iterable 函数执行时的作用域。
		 * @param {Object/Boolean} [args] 参数/是否间接传递。
		 * @return {Object}  返回的对象。
		 * @example 
		 * 该函数支持多个功能。主要功能是将一个对象根据一个关系变成新的对象。
		 * <code>
		 * Object.update(["aa","aa23"], "length", []); // => [2, 4];
		 * Object.update([{a: 1},{a: 4}], "a", [{},{}], true); // => [{a: 1},{a: 4}];
		 * </code>
		 * */
		update: function (iterable, fn, dest, args) {
			
			// 如果没有目标，源和目标一致。
			dest = dest || iterable;
			
			// 遍历源。
			o.each(iterable, Function.isFunction(fn) ? function (value, key) {
                
				// 执行函数获得返回。
				value = fn.call(args, value, key);
				
				// 只有不是 undefined 更新。
                if(value !== undefined)
				    dest[key] = value;
			} : function (value, key) {
				
				// 如果存在这个值。即源有 fn 内容。
				if(value != undefined) {
					
					value = value[fn];
					
					assert(!args || dest[key], "Object.update(iterable, fn, dest, args): 试图把iterable[{key}][{fn}] 放到 dest[key][fn], 但  dest[key] 是一个空的成员。", key, fn);
					
					// 如果属性是非函数，则说明更新。 a.value -> b.value
					if(args)
						dest[key][fn] = value;
						
					// 类似函数的更新。 a.value -> value
					else
						dest[key] = value;
				}
                    
			});
			
			// 返回目标。
			return dest;
		},

		/**
		 * 判断一个变量是否是引用变量。
		 * @param {Object} object 变量。
		 * @return {Boolean} 所有对象变量返回 true, null 返回 false 。
		 * @example
		 * <code>
		 * Object.isObject({}); // true
		 * Object.isObject(null); // false
		 * </code>
		 */
		isObject: function (obj) {
			
			// 只检查 null 。
			return obj !== null && typeof obj == "object";
		},
		
		/**
		 * 将一个对象解析成一个类的属性。
		 * @param {Object} obj 类实例。
		 * @param {Object} options 参数。
		 * 这个函数会分析对象，并试图找到一个 属性设置函数。
		 * 当设置对象 obj 的 属性 key 为 value:
		 * 发生了这些事:
		 *      检查，如果存在就调用: obj.setKey(value)
		 * 否则， 检查，如果存在就调用: obj.key(value)
		 * 否则， 检查，如果存在就调用: obj.key.set(value)
		 * 否则，检查，如果存在就调用: obj.set(value)
		 * 否则，执行 obj.key = value;
		 * 
		 * @example
		 * <code>
		 * document.setA = function (value) {
		 * 	  this._a = value;
		 * };
		 * 
		 * Object.set(document, 'a', 3); 
		 * 
		 * // 这样会调用     document.setA(3);
		 * 
		 * </code>
		 */
		set: function (obj, options) {
			
			for(var key in options) {
				
				// 检查 setValue 。
				var setter = 'set' + key.capitalize(),
					val = options[key];
		
		
				if (Function.isFunction(obj[setter]))
					obj[setter](val);
				
				// 是否存在函数。
				else if(Function.isFunction(obj[key]))
					obj[key](val);
				
				// 检查 value.set 。
				else if (obj[key] && obj[key].set)
					obj[key].set(val);
				
				// 检查 set 。
				else if(obj.set)
					obj.set(key, val);
				
				// 最后，就直接赋予。
				else
					obj[key] = val;
		
			}
			
		},
		
		/**
		 * 返回一个变量的类型的字符串形式。
		 * @param {Object} obj 变量。
		 * @return {String} 所有可以返回的字符串：  string  number   boolean   undefined	null	array	function   element  class   date   regexp object。
		 * @example
		 * <code> 
		 * Object.type(null); // "null"
		 * Object.type(); // "undefined"
		 * Object.type(new Function); // "function"
		 * Object.type(+'a'); // "number"
		 * Object.type(/a/); // "regexp"
		 * Object.type([]); // "array"
		 * </code>
		 * */
		type: function (obj) {
			
			//获得类型  。
			var typeName = typeof obj;
			
			// 对象， 直接获取 xType 。
			return obj ? obj.xType || typeName : obj === null ? "null" : typeName;
			
		}

	});

	/**
	 * 数组。
	 * @namespace Array
	 */
	applyIf(Array, {
		
		/**
		 * 判断一个变量是否是数组。
		 * @param {Object} object 变量。
		 * @return {Boolean} 如果是数组，返回 true， 否则返回 false。
		 * @example
		 * <code> 
		 * Array.isArray([]); // true
		 * Array.isArray(document.getElementsByTagName("div")); // false
		 * Array.isArray(new Array); // true
		 * </code>
		 */
		isArray: function (obj) {
			
			// 检查原型。
			return toString.call(obj) === "[object Array]";
		},

		/**
		 * 在原有可迭代对象生成一个数组。
		 * @param {Object} iterable 可迭代的实例。
		 * @param {Number} startIndex=0 开始的位置。
		 * @return {Array} 复制得到的数组。
		 * @example
		 * <code>
		 * Array.create([4,6], 1); // [6]
		 * </code>
		 */
		create: function (iterable, startIndex) {
			//if(!iterable)
			//	return [];
				
			//  [DOM Object] 。
			//if(iterable.item) { 
			//	var r = [], len = iterable.length;
			//	for(startIndex = startIndex || 0; startIndex < len; startIndex++)
			//		r[startIndex] = iterable[startIndex];
			//	return r;
			//}
			
			assert(!iterable || toString.call(iterable) !== '[object HTMLCollection]' || typeof iterable.length !== 'number', 'Array.create(iterable, startIndex): 参数 {iterable} 不支持 DomCollection 。', iterable);
			
			// 调用 slice 实现。
			return iterable ? ap.slice.call(iterable, startIndex) : [];
		}

	});

	/**
	 * 函数。
	 * @namespace Function
	 */
	apply(Function, {
		
		/**
		 * 绑定函数作用域。
		 * @param {Function} fn 函数。
		 * @param {Object} bind 位置。
		 * 注意，未来 Function.prototype.bind 是系统函数， 因此这个函数将在那个时候被 替换掉。
		 * @example
		 * <code>
		 * Function.bind(function () {return this}, 0)()    ; // 0
		 * </code>
		 */
		bind: function (fn, bind) {
					
			assert.isFunction(fn, 'Function.bind(fn): 参数 {fn} ~。');
			
			// 返回对 bind 绑定。
			return function () {
				return fn.apply(bind, arguments);
			}
		},
		
		/**
		 * 空函数。
		 * @property
		 * @type Function
		 * Function.empty返回空函数的引用。
		 */
		empty: emptyFn,

		/**
		 * 一个返回 true 的函数。
		 * @property
		 * @type Function
		 */
		returnTrue: from(true),

		/**
		 * 一个返回 false 的函数。
		 * @property
		 * @type Function
		 */
		returnFalse: from(false),

		/**
		 * 判断一个变量是否是函数。
		 * @param {Object} object 变量。
		 * @return {Boolean} 如果是函数，返回 true， 否则返回 false。
		 * @example
		 * <code>
		 * Function.isFunction(function () {}); // true
		 * Function.isFunction(null); // false
		 * Function.isFunction(new Function); // true
		 * </code>
		 */
		isFunction: function (obj) {
			
			// 检查原型。
			return toString.call(obj) === "[object Function]";
		},
		
		/**
		 * 返回自身的函数。
		 * @param {Object} v 需要返回的参数。
		 * @return {Function} 执行得到参数的一个函数。
		 * @hide
		 * @example
		 * <code>
		 * Function.from(0)()    ; // 0
		 * </code>
		 */
		from: from
		
	});

	/**
	 * 字符串。
	 * @namespace String
	 */
	apply(String, {

		/**
		 * 格式化字符串。
		 * @param {String} format 字符。
		 * @param {Object} ... 参数。
		 * @return {String} 格式化后的字符串。
		 * @example
		 * <code>
		 *  String.format("{0}转换", 1); //  "1转换"
		 *  String.format("{1}翻译",0,1); // "1翻译"
		 *  String.format("{a}翻译",{a:"也可以"}); // 也可以翻译
		 *  String.format("{{0}}不转换, {0}转换", 1); //  "{0}不转换1转换"
		 *  格式化的字符串{}不允许包含空格。
		 *  不要出现{{{ 和  }}} 这样将获得不可预知的结果。
		 * </code>
		 */
		format: function (format, args) {
					
			assert(!format || format.replace, 'String.format(format, args): 参数 {format} 必须是字符串。', format);

			//支持参数2为数组或对象的直接格式化。
			var toString = this;
			
			args = arguments.length === 2 && o.isObject(args) ? args: ap.slice.call(arguments, 1);

			//通过格式化返回
			return (format || "").replace(rFormat, function (match, name) {
				var start = match.charAt(1) == '{',
					end = match.charAt(match.length - 2) == '}';
				if (start || end) return match.slice(start, match.length - end);
				//LOG : {0, 2;yyyy} 为了支持这个格式, 必须在这里处理 match , 同时为了代码简短, 故去该功能。
				return name in args ? toString(args[name]) : "";
			});
		},
		
		/**
		 * 将一个数组源形式的字符串内容拷贝。
		 * @param {Object} str 字符串。用空格隔开。
		 * @param {Object/Function} source 更新的函数或源。
		 * @param {Object} [dest] 如果指明了， 则拷贝结果到这个目标。
		 * @param {Boolean} copyIf=false 是否跳过本来存在的数据。
		 * @example
		 * <code>
		 * String.map("aaa bbb ccc", trace); //  aaa bbb ccc
		 * String.map("aaa bbb ccc", function (v) { return v; }, {});    //    {aaa:aaa, bbb:bbb, ccc:ccc};
		 * </code>
		 */
		map: function (str, src, dest, copyIf) {
					
			assert(typeof str == 'string', 'String.map(str, src, dest, copyIf): 参数 {str} 必须是字符串。', str);
			
			var isFn = Function.isFunction(src);
			// 使用 ' '、分隔, 这是约定的。
			str.split(' ').forEach(function (value, index, array) {
				
				// 如果是函数，调用函数， 否则是属性。
				var val = isFn ? src(value, index, array) : src[value];
				
				// 如果有 dest ，则复制。
				if(dest && !(copyIf && (value in dest)))
					dest[value] = val;
			});
			return dest;
		},
		
		/**
		 * 返回变量的地址形式。
		 * @param {Object} obj 变量。
		 * @return {String} 字符串。
		 * @example
		 * <code>
		 * String.param({a: 4, g: 7}); //  a=4&g=7
		 * </code>
		 */
		param: function (obj) {
			if(!obj) return "";
			var s = [], e = encodeURIComponent;
			o.each(obj, function ( value, key ) {
				s.push(e(key) + '=' + e(value));
			});
			
			//  %20 -> +  。
			return s.join('&').replace(rWhite, '+');
		},
	
		/**
		 * 把字符串转为指定长度。
		 * @param {String} value   字符串。
		 * @param {Number} len 需要的最大长度。
		 * @example
		 * <code>
		 * String.ellipsis("123", 2); //   '1...'
		 * </code>
		 */
		ellipsis: function (value, len) {
			assert.isString(value, "String.ellipsis(value, len): 参数  {value} ~。");
			assert.isNumber(len, "String.ellipsis(value, len): 参数  {len} ~。");
			return value.length > len ?  value.substr(0, len - 3) + "..." : value;
		}
		
	});
	
	/// #ifdef SupportIE8
	
	/**
	 * 日期。
	 * @namespace Date
	 */
	applyIf(Date, {
		
		/**
		 * 获取当前时间。
		 * @return {Number} 当前的时间点。
		 * @example
		 * <code>
		 * Date.now(); //   相当于 new Date().getTime()
		 * </code>
		 */
		now: function () {
			return +new Date;
		}
		
	});
	
	/// #endif
	
	
	/// #endregion
	
	/// #region 浏览器

	/**
	 * 浏览器。
	 * @namespace navigator
	 */
	applyIf(navigator, (function (ua, isNonStandard) {

		//检查信息
		var match = ua.match(/(IE|Firefox|Chrome|Safari|Opera|Navigator).((\d+)\.?[\d.]*)/i) || ["", "Other", 0, 0],
			
			// 版本信息。
			version = ua.match(/(Version).((\d+)\.?[\d.]*)/i) || match,
			
			// 浏览器名字。
			browser = match[1];
		
		
		navigator["is" + browser] = navigator["is" + browser + version[3]] = true;
		
		/**
		 * 获取一个值，该值指示是否为 IE 浏览器。
		 * @getter isIE
		 * @type Boolean
		 */
		
		
		/**
		 * 获取一个值，该值指示是否为 Firefox 浏览器。
		 * @getter isFirefox
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Chrome 浏览器。
		 * @getter isChrome
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Opera 浏览器。
		 * @getter isOpera
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Safari 浏览器。
		 * @getter isSafari
		 * @type Boolean
		 */
		
		//结果
		return {
			
			/// #ifdef SupportIE6
			
			/**
			 * 获取一个值，该值指示当前浏览器是否支持标准事件。就目前浏览器状况， IE6，7 中 isQuirks = true  其它皆 false 。
			 * @type Boolean
			 * 此处认为 IE6,7 是怪癖的。
			 */
			isQuirks: isNonStandard && !o.isObject(document.constructor),
			
			/// #endif
			
			/// #ifdef SupportIE8
			
			/**
			 * 获取一个值，该值指示当前浏览器是否为标准浏览器。
			 * @type Boolean
			 * 此处认为 IE6, 7, 8 不是标准的浏览器。
			 */
			isStandard: !isNonStandard,
			
			/// #endif
			
			/**
			 * 获取当前浏览器的简写。
			 * @type String
			 */
			name: browser,
			
			/**
			 * 获取当前浏览器版本。
			 * @type String
			 * 输出的格式比如 6.0.0 。
			 * 这是一个字符串，如果需要比较版本，应该使用 parseFloat(navigator.version) < 4 。
			 */
			version: version[2]
			
		};
	
	})(navigator.userAgent, !-[1,]));

	/// #endregion
	
	/// #region 内部函数

	/**
	 * xType。
	 */
	Date.prototype.xType = "date";
	
	/**
	 * xType。
	 */
	RegExp.prototype.xType = "regexp";
	
	
	// 把所有内建对象本地化 。
	each.call([String, Array, Function, Date, Number], p.Native);
	
	/**
	 * @class JPlus.Object
	 */
	Object.implement({
		
		/**
		 * 调用父类的成员变量。
		 * @param {String} methodName 属性名。
		 * @param {Object} ... 调用的参数数组。
		 * @return {Object} 父类返回。
		 * 注意只能从子类中调用父类的同名成员。
		 * @protected
		 * @example
		 * <code>
		 * 
		 * var MyBa = new Class({
		 *    a: function (g, b) {
		 * 	    alert(g + b);
		 *    }
		 * });
		 * 
		 * var MyCls = MyBa.extend({
		 * 	  a: function (g, b) {
		 * 	    this.base('a', g, b);   // 或   this.base('a', arguments);
		 *    }
		 * });
		 * 
		 * new MyCls().a();   
		 * </code>
		 */
		base: function (methodName, args) {
			
			var me = this.constructor,
			
				fn = this[methodName];
				
			assert(fn, "Object.prototype.base(methodName, args): 子类不存在 {methodName} 的属性或方法。", name);
			
			// 标记当前类的 fn 已执行。
			fn.$bubble = true;
				
			assert(!me || me.prototype[methodName], "Object.prototype.base(methodName, args): 父类不存在 {methodName} 的属性或方法。", name);
			
			// 保证得到的是父类的成员。
			
			do {
				me = me.base;
				assert(me && me.prototype[methodName], "Object.prototype.base(methodName, args): 父类不存在 {methodName} 的属性或方法。", name);
			} while('$bubble' in (fn = me.prototype[methodName]));
			
			assert.isFunction(fn, "Object.prototype.base(methodName, args): 父类的成员 {fn}不是一个函数。  ");
			
			fn.$bubble = true;
			
			// 确保 bubble 记号被移除。
			try {
				if(args === arguments.callee.caller.arguments)
					return fn.apply(this, args);
				arguments[0] = this;
				return fn.call.apply(fn, arguments);
			} finally {
				delete fn.$bubble;
			}
		}
	
	});
	
	/**
	 * @class String 
	 */
	String.implementIf({

		/// #ifdef SupportIE8

		/**
		 * 去除首尾空格。
		 * @return {String}    处理后的字符串。
	     * @example
		 * <code>
		 * "   g h   ".trim(); //     "g h"
		 * </code>
		 */
		trim: function () {
			
			// 使用正则实现。
			return this.replace(rSpace, "");
		},
		
		/// #endif
		
		/**
	     * 转为骆驼格式。
	     * @param {String} value 内容。
	     * @return {String} 返回的内容。
	     * @example
		 * <code>
		 * "font-size".toCamelCase(); //     "fontSize"
		 * </code>
	     */
		toCamelCase: function () {
	        return this.replace(rToCamelCase, toUpperCase);
	    },
		
		/**
		 * 将字符首字母大写。
		 * @return {String} 大写的字符串。
	     * @example
		 * <code>
		 * "bb".capitalize(); //     "Bb"
		 * </code>
		 */
		capitalize: function () {
			
			// 使用正则实现。
			return this.replace(rFirstChar, toUpperCase);
		}

	});
	
	/**
	 * @class Array
	 */
	Array.implementIf({

		/**
		 * 对数组运行一个函数。
		 * @param {Function} fn 函数.参数 value, index
		 * @param {Object} bind 对象。
		 * @return {Boolean} 有无执行完。
		 * @method
		 * @seeAlso Array.prototype.forEach
		 * @example
		 * <code> 
		 * [2, 5].each(function (value, key) {
		 * 		trace(value);
		 * 		return false
		 * });
		 * // 输出 '2'
		 * </code>
		 */
		each: each,

		/// #ifdef SupportIE8

		/**
		 * 返回数组某个值的第一个位置。值没有,则为-1 。
		 * @param {Object} item 成员。
		 * @param {Number} start=0 开始查找的位置。
		 * @return Number 位置，找不到返回 -1 。 
		 * 现在大多数浏览器已含此函数.除了 IE8-  。
		 */
		indexOf: function (item, startIndex) {
			startIndex = startIndex || 0;
			for (var len = this.length; startIndex < len; startIndex++)
				if (this[startIndex] === item)
					return startIndex;
			return -1;
		},
		
		/**
		 * 对数组每个元素通过一个函数过滤。返回所有符合要求的元素的数组。
		 * @param {Function} fn 函数。参数 value, index, this。
		 * @param {Object} bind 绑定的对象。
		 * @return {Array} 新的数组。
		 * @seeAlso Array.prototype.select
		 * @example
		 * <code> 
		 * [1, 7, 2].filter(function (key) {return key &lt; 5 })   [1, 2]
		 * </code>
		 */
		filter: function (fn, bind) {
			var r = [];
			ap.forEach.call(this, function (value, i, array) {
				
				// 过滤布存在的成员。
				if(fn.call(this, value, i, array))
					r.push(value);
			}, bind);
			
			return r;

		},

		/**
		 * 对数组内的所有变量执行函数，并可选设置作用域。
		 * @method
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身}
		 * @param {Object} bind 函数执行时的作用域。
		 * @seeAlso Array.prototype.each
		 * @example
		 * <code> 
		 * [2, 5].forEach(function (value, key) {
		 * 		trace(value);
		 * });
		 * // 输出 '2' '5'
		 * </code>
		 * */
		forEach: each,
		
		/// #endif

		/**
		 * 包含一个元素。元素存在直接返回。
		 * @param {Object} value 值。
		 * @return {Boolean} 是否包含元素。
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].include(""); //   true
		 * [false].include(0);	//   false
		 * </code>
		 */
		include: function (value) {
			
			//未包含，则加入。
			var b = this.indexOf(value) !== -1;
			if(!b)
				this.push(value);
			return b;
		},
		
		/**
		 * 在指定位置插入项。
		 * @param {Number} index 插入的位置。
		 * @param {Object} value 插入的内容。
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].insert(3, 4); //   ["", "aaa", "zzz", 4, "qqq"]
		 * </code>
		 */
		insert: function (index, value) {
			assert.isNumber(index, "Array.prototype.insert(index, value): 参数 index ~。");
			var me = this,
				tmp = ap.slice.call(me, index);
			me.length = index + 1;
			this[index] = value;
			ap.push.apply(me, tmp);
			return me;
			
		},
		
		/**
		 * 对数组成员调用指定的成员，返回结果数组。
		 * @param {String} func 调用的成员名。
		 * @param {Array} args 调用的参数数组。
		 * @return {Array} 结果。
		 * @example
		 * <code>
		 * ["vhd"].invoke('charAt', [0]); //    ['v']
		 * </code>
		 */
		invoke: function (func, args) {
			assert(args && typeof args.length === 'number', "Array.prototype.invoke(func, args): 参数 {args} 必须是数组, 无法省略。", args);
			var r = [];
			ap.forEach.call(this, function (value) { 
				assert(value != null && value[func] && value[func].apply, "Array.prototype.invoke(func, args): {value} 不包含函数 {func}。", value, func);
				r.push(value[func].apply(value, args));
			});
			
			return r;
		},
		
		/**
		 * 删除数组中重复元素。
		 * @return {Array} 结果。
		 * @example
		 * <code>
		 * [1,7,8,8].unique(); //    [1, 7, 8]
		 * </code>
		 */
		unique: function () {
			
			// 删除从 i + 1 之后的当前元素。
			for(var i = 0, t, v; i < this.length; ) {
				v = this[i];
				t = ++i;
				do {
					t = ap.remove.call(this, v, t);
				} while(t >= 0);
			}
			
			return this;
		},
		
		/**
		 * 删除元素, 参数为元素的内容。
		 * @param {Object} value 值。
		 * @return {Number} 删除的值的位置。
		 * @example
		 * <code>
		 * [1,7,8,8].remove(7); //   1
		 * </code>
		 */
		remove: function (value, startIndex) {
			
			// 找到位置， 然后删。
			var i = ap.indexOf.call(this, value, startIndex);
			if(i !== -1) ap.splice.call(this, i, 1);
			return i;
		},
			
		/**
		 * 获取指定索引的元素。如果 index < 0， 则获取倒数 index 元素。
		 * @param {Number} index 元素。
		 * @return {Object} 指定位置所在的元素。
		 * @example
		 * <code>
		 * [1,7,8,8].item(0); //   1
		 * [1,7,8,8].item(-1); //   8
		 * [1,7,8,8].item(5); //   undefined
		 * </code>
		 */
		item: function (index) {
			return this[index < 0 ? this.length + index : index];
		},
		
		/**
		 * xType。
		 */
		xType: "array"

	});
	
	/// #endregion
	
	/// #region 远程请求
	
	
	/// #ifdef SupportIE6
	
	/**
	 * 生成一个请求。
	 * @class window.XMLHttpRequest
	 * @return {XMLHttpRequest} 请求的对象。
	 */
	
	// IE 7 的  XMLHttpRequest 有错，强制覆盖。
	if(navigator.isQuirks|| !window.XMLHttpRequest) {
		window.XMLHttpRequest = function () {
			return new ActiveXObject("Microsoft.XMLHTTP");
		};
	}
	
	
	/// #endif
	
	/**
	 * @class
	 */
	
	/// #endregion

	/// #region 页面
	
		
	if(!window.execScript)
	
		/**
		 * 全局运行一个函数。
		 * @param {String} statement 语句。
		 * @return {Object} 执行返回值。
		 * @example
		 * <code>
		 * execScript('alert("hello")');
		 * </code>
		 */
		window.execScript = function(statements) {
			
			// 如果正常浏览器，使用 window.eval  。
			window.eval(statements);

		};
		
	// 将以下成员赋予 window ，这些成员是全局成员。
	String.map('undefined Class IEvent using namespace', p, window);
	
	/**
	 * id种子 。
	 * @type Number
	 */
	p.id = Date.now() % 100;
	
	/**
	 * JPlus 安装的根目录, 可以为相对目录。
	 * @config {String}
	 */
	if(!p.rootPath) {
		try {
			var scripts = document.getElementsByTagName("script");
			
			// 当前脚本在 <script> 引用。最后一个脚本即当前执行的文件。
			scripts = scripts[scripts.length - 1];
					
			// IE6/7 使用  getAttribute
			scripts = navigator.isQuirks ? scripts.getAttribute('src', 5) : scripts.src;
			
			// 设置路径。
			p.rootPath = (scripts.match(/[\S\s]*\//) || [""])[0];
		
		} catch(e) {
			
			// 出错后，设置当前位置.			
			p.rootPath = "";
		}
			
		
		
	}

	/// #endregion
	
	/// #region 函数
	
	/**
	 * 复制所有属性到任何对象。 
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function apply(dest, src) {
		
		assert(dest != null, "Object.extend(dest, src): 参数 {dest} 不可为空。", dest);
		
		// 直接遍历，不判断是否为真实成员还是原型的成员。
		for (var b in src)
			dest[b] = src[b];
		return dest;
	}
	
	/**
	 * 如果不存在就复制所有属性到任何对象。 
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function applyIf(dest, src) {
		
		assert(dest != null, "Object.extendIf(dest, src): 参数 {dest} 不可为空。", dest);
		
		// 和 apply 类似，只是判断目标的值是否为 undefiend 。
		for (var b in src)
			if (dest[b] === undefined)
				dest[b] = src[b];
		return dest;
	}

	/**
	 * 对数组运行一个函数。
	 * @param {Function} fn 遍历的函数。参数依次 value, index, array 。
	 * @param {Object} bind 对象。
	 * @return {Boolean} 返回一个布尔值，该值指示本次循环时，有无出现一个函数返回 false 而中止循环。
	 */
	function each(fn, bind) {
		
		assert(Function.isFunction(fn), "Array.prototype.each(fn, bind): 参数 {fn} 必须是一个函数。", fn);
		
		var i = -1,
			me = this;
			
		while (++i < me.length)
			if(fn.call(bind, me[i], i, me) === false)
				return false;
		return true;
	}
	
	/**
	 * 所有自定义类的基类。
	 */
	function Object() {
	
	}
	
	/**
	 * 返回返回指定结果的函数。
	 * @param {Object} ret 结果。
	 * @return {Function} 函数。
	 */
	function from(ret) {
		
		// 返回一个值，这个值是当前的参数。
		return function () {
			return ret;
		}
	}
	
	/**
	 * 将一个字符转为大写。
	 * @param {String} match 字符。
	 */
	function toUpperCase(ch, match) {
		return match.toUpperCase();
	}
	
	/**
	 * 空函数。
	 */
	function emptyFn() {
		
	}
	
	/**
	 * 获取指定的对象所有的事件管理器。
	 * @param {Object} obj 要使用的对象。
	 * @param {String} type 事件名。
	 * @return {Object} 符合要求的事件管理器，如果找不到合适的，返回默认的事件管理器。
	 */
	function getMgr(eMgr, type) {
		var evt = eMgr.constructor;
		
		// 遍历父类， 找到适合的 eMgr 。
		while(!(eMgr = eventMgr[eMgr.xType]) || !(eMgr = eMgr[type])) {
			
			if(evt && (evt = evt.base)) {
				eMgr = evt.prototype;
			} else {
				return eventMgr.$default;
			}
		
		}
		
		return eMgr;
	}

	/**
	 * 定义名字空间。
	 * @param {String} ns 名字空间。
	 * @param {Object} obj 值。
	 */
	function namespace(ns, obj) {
		
		assert(ns && ns.split, "namespace(namespace, obj, value): 参数 {namespace} 不是合法的名字空间。", ns);
		
		
		// 简单声明。
		if (arguments.length == 1) {
			
			/// #ifdef SupportUsing
			
			// 加入已使用的名字空间。
			return   p.namespaces.include(ns);
			
			/// #else
			
			/// return ;
			
			/// #endif
		}
		
		// 取值，创建。
		ns = ns.split('.');
		
		// 如果第1个字符是 ., 则表示内置使用的名字空间。
		var current = window, i = -1, len = ns.length - 1, dft = !ns[0];
		
		// 如果第一个字符是 . 则补上默认的名字空间。
		ns[0] = ns[0] || p.defaultNamespace;
		
		// 依次创建对象。
		while(++i < len)
			current = current[ns[i]] || (current[ns[i]] = {});

  		// 如果最后一个对象是 . 则覆盖到最后一个对象， 否则更新到末尾。
		if(i = ns[len])
			current[i] = applyIf(obj, current[i] || {});
		else {
			obj = applyIf(current, obj);
			i = ns[len - 1];
		}
		
		// 如果是内置使用的名字空间，将最后一个成员更新为全局对象。
		if(dft)
			window[i] = obj;
		
		return obj;
		
		
		
	}

	/// #endregion

})(this);



// ===========================================
//   调试        C
// ===========================================

///  #ifdef Debug
///  #region 调试


/**
 * @namespace String
 */
Object.extend(String, {
	
	/**
	 * 将字符串转为 utf-8 字符串。
	 * @param {String} s 字符串。
	 * @return {String} 返回的字符串。
	 */
	toUTF8:function (s) {
		return s.replace(/[^\x00-\xff]/g, function (a,b) {
			return '\\u' + ((b=a.charCodeAt()) < 16 ? '000' : b<256 ? '00' : b<4096 ? '0' : '') + b.toString(16);
		});
	},
    
	/**
	 * 将字符串从 utf-8 字符串转义。
	 * @param {String} s   字符串。
	 * @return {String} 返回的字符串。
	 */
	fromUTF8:function (s) {
		return s.replace(/\\u([0-9a-f]{3})([0-9a-f])/gi,function (a,b,c) {return String.fromCharCode((parseInt(b,16)*16+parseInt(c,16)))})
	}
		
});
 


/**
 * 调试输出。
 * @param {Object} obj 值。
 * @param {String} args 格式化的字符串。
 */
function trace(obj, args) {

	if (arguments.length == 0 || !JPlus.trace) return; // 关闭调试
	
	var useConsole = window.console && console.log;

	if (typeof obj == "string") {
		if(arguments.length > 1)
			obj = String.format.apply(trace.inspect, arguments);
		// 存在       console
		//   IE8  存在控制台，这是好事，但问题是IE8的控制台对对象输出全为 [object] 为了更好的调试，我们期待自定义的调试信息。
		//    为了支持类的输出，也不使用默认的函数输出
	} else if (!useConsole || navigator.isIE8) {
		obj = trace.inspect(obj, args);
	}


	if (useConsole) console.log(obj);
	else trace.write(obj);
}

/**
 * @namespace trace
 */
Object.extendIf(trace, {
	
	/**
	 * 输出方式。  {@param {String} message 信息。}
	 * @type Function
	 */
	write: function (message) {
		alert(message);
	},
	
	/**
	 * 输出类的信息。
	 * @param {Object} [obj] 要查看成员的对象。如果未提供这个对象，则显示全局的成员。
	 * @param {Boolean} showPredefinedMembers=true 是否显示内置的成员。
	 */
	api: (function () {
		
		var nodeTypes = 'Window Element Attr Text CDATASection Entity EntityReference ProcessingInstruction Comment HTMLDocument DocumentType DocumentFragment Document Node'.split(' '),
		
			definedClazz = 'String Date Array Number RegExp Function XMLHttpRequest Object'.split(' ').concat(nodeTypes),
	
			predefinedNonStatic = {
				'Object': 'valueOf hasOwnProperty toString',
				'String': 'length charAt charCodeAt concat indexOf lastIndexOf match quote slice split substr substring toLowerCase toUpperCase trim sub sup anchor big blink bold small fixed fontcolor italics link',
				'Array': 'length pop push reverse shift sort splice unshift concat join slice indexOf lastIndexOf filter forEach', /* ' every map some reduce reduceRight'  */
				'Number': 'toExponential toFixed toLocaleString toPrecision',
				'Function': 'length apply call',
				'Date': 'getDate getDay getFullYear getHours getMilliseconds getMinutes getMonth getSeconds getTime getTimezoneOffset getUTCDate getUTCDay getUTCFullYear getUTCHours getUTCMinutes getUTCMonth getUTCSeconds getYear setDate setFullYear setHours setMinutes setMonth setSeconds setTime setUTCDate setUTCFullYear setUTCHours setUTCMilliseconds setUTCMinutes setUTCMonth setUTCSeconds setYear toGMTString toLocaleString toUTCString',
				'RegExp': 'exec test'
			},
			
			predefinedStatic = {
				'Array': 'isArray',
				'Number': 'MAX_VALUE MIN_VALUE NaN NEGATIVE_INFINITY POSITIVE_INFINITY',
				'Date': 'now parse UTC'
			},
			
			APIInfo = Class({
				
				memberName: '',
				
				title: 'API 信息:',
				
				prefix: '',
				
				getPrefix: function (obj) {
					if(!obj) return "";
					for(var i = 0; i < definedClazz.length; i++) {
						if(window[definedClazz[i]] === obj) {
							return this.memberName = definedClazz[i];
						}
					}
					
					return this.getTypeName(obj, window, "", 3);
				},
				
				getTypeName: function (obj, base, baseName, deep) {
								
					for(var memberName in base) {
						if(base[memberName] === obj) {
							this.memberName = memberName;
							return baseName + memberName;
						}
					}
				           
					if(deep-- > 0) {
						for(var memberName in base) {
							try{
								if(base[memberName] && isUpper(memberName, 0)) {
									memberName = this.getTypeName(obj, base[memberName], baseName + memberName + ".", deep);
									if(memberName) 
										return memberName;
								}
							}catch(e) {}
						}
					}
					
					return '';
				},
				
				getBaseClassDescription: function (obj) {
					if(obj && obj.base) {
						var extObj = this.getTypeName(obj.base, window, "", 3);
						return " 类" + (extObj && extObj != "JPlus.Object"  ? "(继承于 " + extObj + " 类)" : "");
					}
					
					return " 类";
				},
				
				/**
				 * 获取类的继承关系。
				 */
				getExtInfo: function (clazz) {
					if(!this.baseClasses) {
						this.baseClassNames = [];
						this.baseClasses = [];
						while(clazz && clazz.prototype) {
							var name = this.getPrefix(clazz);
							if(name) {
								this.baseClasses.push(clazz);
								this.baseClassNames.push(name);	
							}
							
							clazz = clazz.base;
						}
					}
					
					
				},
				
				constructor: function (obj, showPredefinedMembers) {
					this.members = {};
					this.sortInfo = {};
				
					this.showPredefinedMembers = showPredefinedMembers !== false;
					this.isClass = obj === Function || (obj.prototype && obj.prototype.constructor !== Function);
					
					//  如果是普通的变量。获取其所在的原型的成员。
					if(!this.isClass && obj.constructor !== Object) {
						this.prefix = this.getPrefix(obj.constructor);
						
						if(!this.prefix) {
							var nodeType = obj.replaceChild ? obj.nodeType : obj.setInterval && obj.clearTimeout ? 0 : null;
							if(nodeType) {
								this.prefix = this.memberName = nodeTypes[nodeType];
								if(this.prefix) {
									this.baseClassNames = ['Node', 'Element', 'HTMLElement', 'Document'];
									this.baseClasses = [window.Node, window.Element, window.HTMLElement, window.HTMLDocument];
								}
							}
						}
						
						if(this.prefix) {
							this.title = this.prefix + this.getBaseClassDescription(obj.constructor) + "的实例成员: ";
							this.prefix += '.prototype.';
						}
						
						if([Number, String, Boolean].indexOf(obj.constructor) === -1) {
							var betterPrefix = this.getPrefix(obj);
							if(betterPrefix) {
								this.orignalPrefix = betterPrefix + ".";
							}
						}
							
					}
					
					if(!this.prefix) {
						
						this.prefix = this.getPrefix(obj);
						 
						// 如果是类或对象， 在这里遍历。
						if(this.prefix) {
							this.title = this.prefix + (this.isClass ? this.getBaseClassDescription(obj) : ' ' + getMemberType(obj, this.memberName)) + "的成员: ";
							this.prefix += '.';
						}
					
					}
				    
					// 如果是类，获取全部成员。
					if(this.isClass) {
						this.getExtInfo(obj);
						this.addStaticMembers(obj);
						this.addStaticMembers(obj.prototype, 1, true);
						delete this.members.prototype;
						if(this.showPredefinedMembers) {
							this.addPredefinedNonStaticMembers(obj, obj.prototype, true);
							this.addPredefinedMembers(obj, obj, predefinedStatic);
						}
						
					} else {
						this.getExtInfo(obj.constructor);
						// 否则，获取当前实例下的成员。
						this.addStaticMembers(obj);
						
						if(this.showPredefinedMembers && obj.constructor) {
							this.addPredefinedNonStaticMembers(obj.constructor, obj);
						}
					
					}
				},
				
				addStaticMembers: function (obj, nonStatic) {
					for(var memberName in obj) {
						try {
							this.addMember(obj, memberName, 1, nonStatic);
						} catch(e) {
						}
					}
					
				},
				
				addPredefinedMembers: function (clazz, obj, staticOrNonStatic, nonStatic) {
					for(var type in staticOrNonStatic) {
						if(clazz === window[type]) {
							staticOrNonStatic[type].forEach(function (memberName) {
								this.addMember(obj, memberName, 5, nonStatic);
							}, this);
						}
					}
				},
				
				addPredefinedNonStaticMembers: function (clazz, obj, nonStatic) {
					
					if(clazz !== Object) {
						
						predefinedNonStatic.Object.forEach(function (memberName) {
							if(clazz.prototype[memberName] !== Object.prototype[memberName]) {
								this.addMember(obj, memberName, 5, nonStatic);
							}
						}, this);
					
					}
						
					if(clazz === Object && !this.isClass) {
						return;	
					}
					
					this.addPredefinedMembers(clazz, obj, predefinedNonStatic, nonStatic);
					
					
					
				},
				
				addMember: function (base, memberName, type, nonStatic) {
					
					var hasOwnProperty = Object.prototype.hasOwnProperty,
						owner = hasOwnProperty.call(base, memberName),
						prefix,
						extInfo = '';
						
					nonStatic = nonStatic ? 'prototype.' : '';
					
					// 如果 base 不存在 memberName 的成员，则尝试在父类查找。
					if(owner) {
						prefix = this.orignalPrefix || (this.prefix + nonStatic);
						type--;  // 自己的成员置顶。
					} else {
						
						// 搜索包含当前成员的父类。
						this.baseClasses.each(function (baseClass, i) {
							if(baseClass.prototype[memberName] === base[memberName] && hasOwnProperty.call(baseClass.prototype, memberName)) {
								prefix = this.baseClassNames[i] + ".prototype.";
								
								if(nonStatic)
									extInfo = '(继承的)';
									
								return  false;
							}
						}, this);
						
						// 如果没找到正确的父类，使用当前类替代，并指明它是继承的成员。
						if(!prefix) {   
							prefix = this.prefix + nonStatic;
							extInfo = '(继承的)';
						}
						
						
						
					}
					
					this.sortInfo[this.members[memberName] = (type >= 4 ? '[内置]' : '') + prefix + getDescription(base, memberName) + extInfo] = type + memberName;
					
				},
				
				copyTo: function (value) {
					for(var member in this.members) {
						value.push(this.members[member]);
					}
					
					if(value.length) {
						var sortInfo = this.sortInfo;
						value.sort(function (a, b) {return sortInfo[a] < sortInfo[b] ? -1 : 1;});
						value.unshift(this.title);
					} else {
						value.push(this.title + '没有可用的 API 信息。');
					}
					
					
					
				}
				
				
			});
		
		
		initPredefined(predefinedNonStatic);
		initPredefined(predefinedStatic);
	
		function initPredefined(predefined) {
			for(var obj in predefined)
				predefined[obj] = predefined[obj].split(' ');
		}
	
		function isEmptyObject(obj) {
			
			// null 被认为是空对象。
			// 有成员的对象将进入 for(in) 并返回 false 。
			for(obj in (obj || {}))
				return false;
			return true;
		}
		
		// 90 是 'Z' 65 是 'A'
		function isUpper(str, index) {
			str = str.charCodeAt(index);
			return str <= 90 && str >= 65;
		}

		function getMemberType(obj, name) {
			
			// 构造函数最好识别。
			if(typeof obj === 'function' && name === 'constructor')
				return '构造函数';
			
			// IE6 的 DOM 成员不被认为是函数，这里忽略这个错误。
			// 有 prototype 的函数一定是类。
			// 没有 prototype 的函数肯能是类。
			// 这里根据命名如果名字首字母大写，则作为空类理解。
			// 这不是一个完全正确的判断方式，但它大部分时候正确。
			// 这个世界不要求很完美，能解决实际问题的就是好方法。
			if(obj.prototype && obj.prototype.constructor)
				return !isEmptyObject(obj.prototype) || isUpper(name, 0) ? '类': '函数';
			
			// 最后判断对象。
			if(Object.isObject(obj))
				return name.charAt(0) === 'I' && isUpper(name, 1) ? '接口' : '对象';
			
			// 空成员、值类型都作为属性。
			return '属性';
		}
		
		function getDescription(base, name) {
			return name + ' ' + getMemberType(base[name], name);
		}
	
		return function (obj, showPredefinedMembers) {
			var r = [];
			
			// 如果没有参数，显示全局对象。
			if(arguments.length === 0) {
				for(var i = 0; i < 7; i++) {
					r.push(getDescription(window, definedClazz[i]));	
				}
	
				for(var name in JPlus)
					if(window[name] && (isUpper(name, 0) || window[name] === JPlus[name]))
						r.push(getDescription(window, name));
				
				r.sort();
				r.unshift('全局对象: ');

			} else if(obj != null) {
				new APIInfo(obj, showPredefinedMembers).copyTo(r);
			} else {
				r.push('无法对 ' + (obj === null ? "null" : "undefined") + ' 分析');
			}
	
			trace(r.join('\r\n'));
	
		};
		
	})() ,
	
	/**
	 * 得到输出指定内容的函数。
	 * @return {Function}
	 */
	from: function (msg) {
		return function () {
			trace(msg, arguments);
			return msg;
		};
	},

	/**
	 * 遍历对象每个元素。
	 * @param {Object} obj 对象。
	 */
	dir: function (obj) {
		if (JPlus.trace) {
			if (window.console && console.dir) 
				console.dir(obj);
			else 
				if (obj) {
					var r = "{\r\n", i;
					for (i in obj) 
						r += "\t" + i + " = " + trace.inspect(obj[i], 1) + "\r\n";
					r += "}";
					trace(r);
				}
		}
	},
	
	/**
	 * 获取对象的字符串形式。
	 * @param {Object} obj 要输出的内容。
	 * @param {Number/undefined} deep=0 递归的层数。
	 * @return String 成员。
	 */
	inspect: function (obj, deep) {
		
		if( deep == null ) deep = 0;
		switch (typeof obj) {
			case "function":
				if(deep == 0 && obj.prototype && obj.prototype.xType) {
					// 类
					return String.format(
							"class {0} : {1} {2}",
							obj.prototype.xType,
							(obj.prototype.base && obj.prototype.base.xType || "Object"),
							trace.inspect(obj.prototype, deep + 1)
						);
				}
				
				//  函数
				return deep == 0 ? String.fromUTF8(obj.toString()) : "function ()";
				
			case "object":
				if (obj == null) return "null";
				if(deep >= 3)
					return obj.toString();

				if(Array.isArray(obj)) {
					return "[" + Object.update(obj, trace.inspect, []).join(", ") + "]";
					
				}else{
					if(obj.setInterval && obj.resizeTo)
						return "window";
					if (obj.nodeType) {
						if(obj.nodeType == 9)
							return 'document';
						if (obj.tagName) {
							var tagName = obj.tagName.toLowerCase(), r = tagName;
							if (obj.id) {
								r += "#" + obj.id;
								if (obj.className) 
									r += "." + obj.className;
							}
							else 
								if (obj.outerHTML) 
									r = obj.outerHTML;
								else {
									if (obj.className) 
										r += " class=\"." + obj.className + "\"";
									r = "<" + r + ">" + obj.innerHTML + "</" + tagName + ">  ";
								}
							
							return r;
						}
						
						return '[Node name=' + obj.nodeName + 'value=' + obj.nodeValue + ']';
					}
					var r = "{\r\n", i;
					for(i in obj)
						r += "\t" + i + " = " + trace.inspect(obj[i], deep + 1) + "\r\n";
					r += "}";
					return r;
				}
			case "string":
				return deep == 0 ? obj : '"' + obj + '"';
			case "undefined":
				return "undefined";
			default:
				return obj.toString();
		}
	},
	
	/**
	 * 输出信息。
	 * @param {Object} ... 内容。
	 */
	log: function () {
		if (JPlus.trace) {
			if (window.console && console.log && console.log.apply) {
				console.log.apply(console, arguments);
			} else {
				trace(Object.update(arguments, trace.inspect, []).join(" "));
			}
		}
	},

	/**
	 * 输出一个错误信息。
	 * @param {Object} msg 内容。
	 */
	error: function (msg) {
		if (JPlus.trace) {
			if (window.console && console.error) 
				console.error(msg); //   如果错误在此行产生，说明这是预知错误。
				
			else {
				throw msg;
			}
		}
	},
	
	/**
	 * 输出一个警告信息。
	 * @param {Object} msg 内容。
	 */
	warn: function (msg) {
		if (JPlus.trace) {
			if (window.console && console.warn) 
				console.warn(msg);
			else 
				trace.write("[警告]" + msg);
		}
	},

	/**
	 * 输出一个信息。
	 * @param {Object} msg 内容。
	 */
	info: function (msg) {
		if (JPlus.trace) {
			if (window.console && console.info) 
				console.info(msg);
			else 
				trace.write("[信息]" + msg);
		}
	},

	/**
	 * 如果是调试模式就运行。
	 * @param {Function} f 函数。
	 * @return String 返回运行的错误。如无错, 返回空字符。
	 */
	ifDebug: function (f) {
		if (!JPlus.debug) return;
		try {
			f();
			return "";
		} catch(e) {
			return e;
		}
	},
	
	/**
	 * 清除调试信息。  (没有控制台时，不起任何作用)
	 */
	clear: function () {
		if( window.console && console.clear)
			console.clear();
	},

	/**
	 * 空函数，用于证明函数已经执行过。
	 */
	count: function () {
		trace(JPlus.id++);
	},

	/**
	 * 如果false则输出。
	 * @param {Boolean} condition 字段。
	 * @return {String} msg  输出的内容。
	 */
	ifNot: function (condition, msg) {
		if (!condition) trace.warn(msg);
	},
	
	/**
	 * 输出一个函数执行指定次使用的时间。
	 * @param {Function} fn 函数。
	 * @param {Number} times=1000 运行次数。
	 */
	time: function (fn, times) {
		trace("[时间] " + trace.runTime(fn, times));
	},
	
	/**
	 * 测试某个函数运行一定次数的时间。
	 * @param {Function} fn 函数。
	 * @param {Number} times=1000 运行次数。
	 * @return {Number} 运行的时间 。
	 */
	runTime: function (fn, times) {
		times = times || 1000;
		var d = Date.now();
		while (times-- > 0)
			fn();
		return Date.now() - d;
	}

});

/**
 * 确认一个值正确。
 * @param {Object} bValue 值。
 * @param {String} msg="断言失败" 错误后的提示。
 * @return {Boolean} 返回 bValue 。
 * @example
 * <code>
 * assert(true, "{value} 错误。", value);
 * </code>
 */
function assert(bValue, msg) {
	if (!bValue && JPlus.debug) {
	
		 var val = arguments;

		// 如果启用 [参数] 功能
		if (val.length > 2) {
			var i = 2;
			msg = msg.replace(/\{([\w\.\(\)]*?)\}/g, function (s, x) {
				return val.length <= i ? s : x + " = " + String.ellipsis(trace.inspect(val[i++]), 200);
			});
		}else {
			msg = msg || "断言失败";
		}

		// 错误源
		val = arguments.callee.caller;
		
		if (JPlus.stackTrace !== false) {
		
			while (val.debugStepThrough) 
				val = val.caller;
			
			if (val) msg += "\r\n--------------------------------------------------------------------\r\n" + String.ellipsis(String.fromUTF8(val.toString()), 600);
			
		}

		if(JPlus.trace)
			trace.error(msg);
		else
			throw new Error(msg);

	}

	return !!bValue;
}

(function () {
	
	function  assertInternal(asserts, msg, value, dftMsg) {
		return assert(asserts, msg ?  msg.replace('~', dftMsg) : dftMsg, value);
	}
	
	function assertInternal2(fn, dftMsg, args) {
		return assertInternal(fn(args[0]), args[1], args[0], dftMsg);
	}
	
	/**
	 * @namespace assert
	 */
	Object.extend(assert, {
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 * @example
		 * <code>
		 * assert.isFunction(a, "a ~");
		 * </code>
		 */
		isFunction: function () {
			return assertInternal2(Function.isFunction, "必须是函数", arguments);
		},
		
		/**
		 * 确认一个值为数组。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isArray: function () {
			return assertInternal2(Array.isArray, "必须是数组", arguments);
		},
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isObject: function (value, msg) {
			return assertInternal(Object.isObject(value) || Function.isFunction(value) || value.nodeType, msg, value,  "必须是引用的对象", arguments);
		},
		
		/**
		 * 确认一个值为数字。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNumber: function (value, msg) {
			return assertInternal(typeof value == 'number' || value instanceof Number, msg, value, "必须是数字");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNode: function (value, msg) {
			return assertInternal(value && value.nodeType, msg, value, "必须是 DOM 节点");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isElement: function (value, msg) {
			return assertInternal(value && value.style, msg, value, "必须是 Element 对象");
		},
		
		/**
		 * 确认一个值是字符串。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isString: function (value, msg) {
			return assertInternal(typeof value == 'string' || value instanceof String, msg, value, "必须是字符串");
		},
		
		/**
		 * 确认一个值是日期。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isDate: function (value, msg) {
			return assertInternal(Object.type(value) == 'date' || value instanceof Date, msg, value, "必须是日期");
		},
		
		/**
		 * 确认一个值是正则表达式。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isRegExp: function (value, msg) {
			return assertInternal(Object.type(value) == 'regexp' || value instanceof RegExp, msg, value, "必须是正则表达式");
		},
	
		/**
		 * 确认一个值非空。
		 * @param {Object} value 值。
		 * @param {String} argsName 变量的名字字符串。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		notNull: function (value, msg) {
			return assertInternal(value != null, msg, value, "不可为空");
		},
	
		/**
		 * 确认一个值在 min ， max 间。
		 * @param {Number} value 判断的值。
		 * @param {Number} min 最小值。
		 * @param {Number} max 最大值。
		 * @param {String} argsName 变量的米各庄。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		between: function (value, min, max, msg) {
			return assertInternal(value >= min && !(value >= max), msg, value, "超出索引, 它必须在 [" + min + ", " + (max === undefined ? "+∞" : max) + ") 间");
		},
	
		/**
		 * 确认一个值属于一个类型。
		 * @param {Object} v 值。
		 * @param {String/Array} types 类型/表示类型的参数数组。
		 * @param {String} message 错误的提示信息。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		instanceOf: function (v, types, msg) {
			if (!Array.isArray(types)) types = [types];
			var ty = typeof v,
				iy = Object.type(v);
			return assertInternal(types.filter(function (type) {
				return type == ty || type == iy;
			}).length, msg, v, "类型错误。");
		},
	
		/**
		 * 确认一个值非空。
		 * @param {Object} value 值。
		 * @param {String} argsName 变量的参数名。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		notEmpty: function (value, msg) {
			return assertInternal(value && value.length, msg, value, "为空");
		}

	});
	
	assertInternal.debugStepThrough = assertInternal2.debugStepThrough = true;
	
	
	for(var fn in assert) { 
		assert[fn].debugStepThrough = true;
	}

	
})();

/// #endregion
/// #endif

//===========================================================



//===========================================
//  元素。 提供最底层的 DOM 辅助函数。  
//  A: xuld
//  R: aki
//===========================================


namespace("System.Dom.Element");
namespace("System.Fx.Base");
namespace("System.Fx.Element");



(function (window) {
	
	
	//  可用的宏     
	// ElementSplit - 是否将当前文件分开为子文件
	// ElementCore - 核心部分
	// ElementTraversing - 节点转移部分
	// ElementManipulation - 节点处理部分
	// ElementStyle - CSS部分
	// ElementAttribute - 属性部分
	// ElementEvent - 事件部分
	// ElementDomReady - 加载部分
	// ElementDimension - 尺寸部分
	// ElementOffset - 定位部分
	
	/// #ifndef ElementSplit
	/// #define ElementCore
	/// #define ElementTraversing
	/// #define ElementManipulation
	/// #define ElementStyle
	/// #define ElementAttribute
	/// #define ElementEvent
	/// #define ElementDomReady
	/// #define ElementDimension
	/// #define ElementOffset
	/// #endif
	
	/**
	 * Object  简写。
	 * @type Object
	 */
	var o = Object,
		
		/**
		 * Object.extend
		 * @type Function
		 */
		apply = o.extend,
	
		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,
		
		/**
		 * String.map 缩写。
		 * @type Object
		 */
		map = String.map,
		
		/**
		 * document 简写。
		 * @type Document
		 */
		document = window.document,
		
		/**
		 * JPlus 简写。
		 * @namespace JPlus
		 */
		p = JPlus,
		
		/// #ifdef SupportIE6
		
		/**
		 * 元素。
		 * @type Function
		 * 如果页面已经存在 Element， 不管是不是用户自定义的，都直接使用。只需保证 Element 是一个函数即可。
		 */
		e = window.Element || function() {},
		
		/// #else
		
		/// e = window.Element,
		
		/// #endif
		
		/**
		 * 元素原型。
		 * @type Object
		 */
		ep = e.prototype,
	
		/**
		 * 用于测试的元素。
		 * @type Element
		 */
		div = document.createElement('DIV'),
		
		/**
		 * 根据一个 id 获取元素。如果传入的id不是字符串，则直接返回参数。
		 * @param {String/Element/Control} id 要获取元素的 id 或元素。
		 */
		$ = getElementById,
		
		/// #ifdef ElementCore
		
		/**
		 * 函数Element.parse使用的新元素缓存。
		 * @type Object
		 */
		cache = {},
	
		/**
		 * 处理 <div/> 格式标签的正则表达式。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	
		/**
		 * 判断是否可以复制的元素的正则表达式。
		 * @type RegExp
		 */
		rNoClone = /<(?:script|object|embed|option|style)/i,
	
		/**
		 * 获取标签名的正则表达式。
		 * @type RegExp
		 */
		rTagName = /<([\w:]+)/,
		
		/**
		 * 在 Element.parse 和 setHtml 中对 HTML 字符串进行包装用的字符串。
		 * @type Object
		 * 部分元素只能属于特定父元素， wrapMap 列出这些元素，并使它们正确地添加到父元素中。
		 * IE678 会忽视第一个标签，所以额外添加一个 div 标签，以保证此类浏览器正常运行。
		 */
		wrapMap = {
			$default:  navigator.isStandard ? [0, '', ''] : [1, '$<div>', '</div>'],
			option: [ 1, '<select multiple="multiple">', '</select>' ],
			legend: [ 1, '<fieldset>', '</fieldset>' ],
			thead: [ 1, '<table>', '</table>' ],
			tr: [ 2, '<table><tbody>', '</tbody></table>' ],
			td: [ 3, '<table><tbody><tr>', '</tr></tbody></table>' ],
			col: [ 2, '<table><tbody></tbody><colgroup>', '</colgroup></table>' ],
			area: [ 1, '<map>', '</map>' ]
		},
		
		/// #endif
		
		/// #ifdef ElementTraversing
		
		/// #ifdef SupportIE6
		
		/**
		 * CSS 选择器。
		 * 对于 IE6/7 提供自定义的选择器。
		 */
		cssSelector = div.querySelectorAll ? [function(selector) {
			return (this.dom || this).querySelector(selector);
		}, function(selector) {
			return new ElementList((this.dom || this).querySelectorAll(selector));
		}] : CssSelector(),
		
		/// #else
		
		/// cssSelector = [function(selector) {
		/// 	return (this.dom || this).querySelector(selector);
		/// }, function(selector) {
		/// 	return new ElementList((this.dom || this).querySelectorAll(selector));
		/// }],
		
		/// #endif
	
		/// #endif

		/// #ifdef ElementAttribute
	
		/**
		 * 表示事件的表达式。
		 * @type RegExp
		 */
		rEventName = /^on(\w+)/,
		
		/**
		 * 特殊属性的列表。
		 * @type Object
		 */
		attributes = {
			innerText: 'innerText' in div ? 'innerText' : 'textContent',
			'for': 'htmlFor',
			'class': 'className'
		},
	
		/// #endif

		/// #ifdef ElementStyle
		
		/**
		 * 特殊样式的列表。
		 * @type Object
		 */
		styles = {
			height: 'setHeight',
			width: 'setWidth'
		},
	
		/// #ifdef SupportIE8

		/**
		 * 透明度的正则表达式。
		 * @type RegExp
		 * IE8 使用滤镜支持透明度，这个表达式用于获取滤镜内的表示透明度部分的子字符串。
		 */
		rOpacity = /opacity=([^)]*)/,
	
		/**
		 * 获取元素的实际的样式属性。
		 * @param {Element} elem 需要获取属性的节点。
		 * @param {String} name 需要获取的CSS属性名字。
		 * @return {String} 返回样式字符串，肯能是 undefined、 auto 或空字符串。
		 */
		getStyle = window.getComputedStyle ? function (elem, name) {
			
			// getComputedStyle为标准浏览器获取样式。
	
			assert.isElement(elem , "Element.getStyle(elem, name): 参数 {elem} ~。");
			
			// 获取真实的样式owerDocument返回elem所属的文档对象
			// 调用getComputeStyle的方式为(elem,null)
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
	
			// 返回 , 在 火狐如果存在 IFrame， 则  computedStyle == null
			//    http://drupal.org/node/182569
			return computedStyle ? computedStyle[ name ] : null;
	
		} : function (elem, name) {
	
			assert.isElement(elem , "Element.getStyle(elem, name): 参数 {elem} ~。");
			
			// 特殊样式保存在 styles 。
			if(name in styles) {
				switch(name) {
					case 'height':
						return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - e.getSize(elem, 'by+py') + 'px';
					case 'width':
						return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - e.getSize(elem, 'bx+px') + 'px';
					case 'opacity':
						return ep.getOpacity.call(elem).toString();
				}
			}
			// currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
			// currentStyle是运行时期样式与style属性覆盖之后的样式
			var r = elem.currentStyle;
			
			if(!r)
				return "";
			
			r = r[name];
	
			// 来自 jQuery
	
			// 如果返回值不是一个带px的 数字。 转换为像素单位
			if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {
	
				// 保存初始值
				var style = elem.style,  left = style.left, rsLeft = elem.runtimeStyle.left;
	
				// 放入值来计算
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = name === "fontSize" ? "1em" : (r || 0);
				r = style.pixelLeft + "px";
	
				// 回到初始值
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
	
			}
	
			return r;
		},
	
		/// #else
	
		/// getStyle = function (elem, name) {
		///
		/// 	// 获取样式
		/// 	var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		///
		/// 	// 返回
		/// 	return computedStyle ? computedStyle[ name ] : null;
		///
		/// },
	
		/// #endif
	
		/// #endif

		/// #if defined(ElementAttribute) || defined(ElementStyle)
	
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 */
		rStyle = /-(\w)|float/,
		
		/**
		 * float 属性的名字。
		 * @type String
		 */
		
		// IE：styleFloat Other：cssFloat
		styleFloat = 'cssFloat' in div.style ? 'cssFloat' : 'styleFloat',
	
		/// #endif
		
		/// #ifdef ElementEvent
		
		/**
		 * @class Event
		 * 用来支持自定义事件的事件对象。
		 */
		pep = {
	
			/**
			 * 构造函数。
			 * @param {Object} target 事件对象的目标。
			 * @param {String} type 事件对象的类型。
			 * @param {Object} [e] 事件对象的属性。
			 * @constructor
			 */
			constructor: function (target, type, e) {
				assert.notNull(target, "JPlus.Event.prototype.constructor(target, type, e): 参数 {target} ~。");
				
				var me = this;
				me.target = target;
				me.srcElement = $(target.dom || target);
				me.type = type;
				apply(me, e);
			},

			/**
			 * 阻止事件的冒泡。
			 * @remark
			 * 默认情况下，事件会向父元素冒泡。使用此函数阻止事件冒泡。
			 */
			stopPropagation : function () {
				this.cancelBubble = true;
			},
					
			/**
			 * 取消默认事件发生。
			 * @remark
			 * 有些事件会有默认行为，如点击链接之后执行跳转，使用此函数阻止这些默认行为。
			 */
			preventDefault : function () {
				this.returnValue = false;
			},
			
			/**
			 * 停止默认事件和冒泡。
			 * @remark
			 * 此函数可以完全撤销事件。
			 * 事件处理函数中 return false 和调用 stop() 是不同的， return false 只会阻止当前事件其它函数执行，
			 * 而 stop() 只阻止事件冒泡和默认事件，不阻止当前事件其它函数。
			 */
			stop: function () {
				this.stopPropagation();
				this.preventDefault();
			}
			
		},
	
		/**
		 * @type Function
		 */
		initUIEvent,
	
		/**
		 * @type Function
		 */
		initMouseEvent,
	
		/**
		 * @type Function
		 */
		initKeyboardEvent,
		
		/// #endif
		
		/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
		
		/**
		 * 扩展的事件对象。
		 */
		eventObj = {
			
			/**
			 * 绑定一个监听器。
			 * @method
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 * @seeAlso removeEventListener
			 * @example
			 * <code>
			 * document.addEventListener('click', function () {
			 * 	
			 * });
			 * </code>
			 */
			addEventListener: document.addEventListener ? function (type, listener) {
				
				//  因为 IE 不支持，所以忽略 第三个参数。
				this.addEventListener(type, listener, false);
				
			} : function (type, listener) {
			
				// IE8- 使用 attachEvent 。
				this.attachEvent('on' + type, listener);
				
			},
	
			/**
			 * 移除一个监听器。
			 * @method
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 *  @param {Boolean} state 类型。
			 * @seeAlso addEventListener
			 * @example
			 * <code>
			 * document.removeEventListener('click', function () {
			 * 
			 * });
			 * </code>
			 */
			removeEventListener: document.removeEventListener ? function (type, listener) {
			
				//  因为 IE 不支持，所以忽略 第三个参数。
				this.removeEventListener(type, listener, false);
				
			}:function (type, listener) {
			
				// IE8- 使用 detachEvent 。
				this.detachEvent('on' + type, listener);
				
			}
		
		},
		
		/// #endif
	
		/// #ifdef ElementDomReady
		
		/// #ifdef SupportIE8
		
		/**
		 * 浏览器使用的真实的 DOMContentLoaded 事件名字。
		 * @type String
		 */
		domReady = navigator.isStandard ? 'DOMContentLoaded' : 'readystatechange',
		
		/// #else
		
		/// domReady = 'DOMContentLoaded',  
		
		/// #endif
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 判断 body 节点的正则表达式。
		 * @type RegExp
		 */
		rBody = /^(?:BODY|HTML|#document)$/i,
		
		/**
		 * 测试是否是绝对位置的正则表达式。
		 * @type RegExp
		 */
		rMovable = /^(?:abs|fix)/,
		
		/**
		 * 获取窗口滚动大小的方法。
		 * @type Function
		 */
		getWindowScroll,
		
		/// #endif
	
		/**
		 * 一个点。
		 * @class Point
		 */
		Point = namespace(".Point", Class({
	
			/**
			 * 初始化 Point 的实例。
			 * @param {Number} x X 坐标。
			 * @param {Number} y Y 坐标。
			 * @constructor Point
			 */
			constructor: function (x, y) {
				this.x = x;
				this.y = y;
			},
	
			/**
			 * 将 (x, y) 增值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			add: function (p) {
				assert(p && 'x' in p && 'y' in p, "Point.prototype.add(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
				return new Point(this.x + p.x, this.y + p.y);
			},
	
			/**
			 * 将一个点坐标减到当前值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			sub: function (p) {
				assert(p && 'x' in p && 'y' in p, "Point.prototype.sub(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
				return new Point(this.x - p.x, this.y - p.y);
			}
			
		})),
		
		/**
		 * 文档对象。
		 * @class Document
		 * 文档对象是对原生 HTMLDocument 对象的补充， 因为 IE6/7 不存在这些对象。
		 * 扩展 Document 也会扩展 HTMLDocument。
		 */
		Document = p.Native(document.constructor || {prototype: document}),
		
		/**
		 * 所有控件基类。
		 * @class Control
		 * @abstract
		 * @extends Element
		 * 控件的周期：
		 * constructor  -  创建控件对于的 Javascript 类。 不建议重写，除非你知道你在做什么。
		 * create - 创建本身的 dom 节点。 可重写 - 默认使用  this.tpl 创建。
		 * init - 初始化控件本身。 可重写 - 默认为无操作。
		 * render - 渲染控件到文档。 不建议重写，如果你希望额外操作渲染事件，则重写。
		 * detach - 删除控件。不建议重写，如果一个控件用到多个 dom 内容需重写。
		 */
		Control = namespace(".Control", Class({
			
			/**
			 * 封装的节点。
			 * @type Element
			 */
			dom: null,
			
			/**
			 * xType 。
			 */
			xType: "control",
		
			/**
			 * 根据一个节点返回。
			 * @param {String/Element/Object} [options] 对象的 id 或对象或各个配置。
			 */
			constructor: function (options) {
				
				// 这是所有控件共用的构造函数。
				
				var me = this,
				
					// 临时的配置对象。
					opt = apply({}, me.options),
					
					// 当前实际的节点。
					dom;
					
				assert(!arguments.length || options, "Control.prototype.constructor(options): 参数 {options} 不能为空。", options);
				
				// 如果存在配置。
				if (options) {
					
					// 如果参数是一个 DOM 节点或 ID 。
					if (typeof options == 'string' || options.nodeType) {
						
						// 直接赋值， 在下面用 $ 获取节点 。
						dom = options;
					} else {
						
						// 否则 options 是一个对象。
						
						// 复制成员到临时配置。
						apply(opt, options);
						
						// 保存 dom 。
						dom = opt.dom;
						delete opt.dom;
					}
				}
				
				// 如果 dom 的确存在，使用已存在的， 否则使用 create(opt)生成节点。
				me.dom = dom ? $(dom) : me.create(opt);
				
				assert(me.dom && me.dom.nodeType, "Control.prototype.constructor(options): 当前实例的 dom 属性为空，或此属性不是 DOM 对象。(检查 options.dom 是否是合法的节点或ID(options 或 options.dom 指定的ID的节点不存在?) 或当前实例的 create 方法是否正确返回一个节点)\r\n当前控件: {dom} {xType}", me.dom, me.xType);
				
				// 调用 init 初始化控件。
				me.init(opt);
				
				// 处理样式。
				if('style' in opt) {
					assert(me.dom.style, "Control.prototype.constructor(options): 当前控件不支持样式。");
					me.dom.style.cssText += ';' + opt.style;
					delete opt.style;
				}
				
				// 复制各个选项。
				Object.set(me, opt);
			},
			
			/**
			 * 当被子类重写时，生成当前控件。
			 * @param {Object} options 选项。
			 * @protected
			 */
			create: function() {
				
				assert(this.tpl, "Control.prototype.create(): 当前类不存在 tpl 属性。Control.prototype.create 会调用 tpl 属性，根据这个属性中的 HTML 代码动态地生成节点并返回。子类必须定义 tpl 属性或重写 Control.prototype.create 方法返回节点。");
				
				// 转为对 tpl解析。
				return Element.parse(this.tpl);
			},
			
			/**
			 * 当被子类重写时，渲染控件。
			 * @method
			 * @param {Object} options 配置。
			 * @protected
			 */
			init: Function.empty,
			
			/**
			 * 创建当前节点的副本，并返回节点的包装。
			 * @param {cloneContent} 是否复制内容 。
		     * @return {Control} 新的控件。
			 */
			cloneNode: function (cloneContent) {
				return new this.constructor(this.dom.cloneNode(cloneContent));
			},
			
			/**
		     * 创建并返回控件的副本。
		     * @param {Boolean} keepId=fasle 是否复制 id 。
		     * @return {Control} 新的控件。
		     */
			clone: function(keepId) {
				
				// 创建一个控件。
				return  new this.constructor(this.dom.nodeType === 1 ? this.dom.clone(false, true, keepId) : this.dom.cloneNode(!keepId));
				
			}
			
		})),
		
		/**
		 * 节点集合。
		 * @class ElementList
		 * @extends Array
		 * ElementList 是对元素数组的只读包装。
		 * ElementList 允许快速操作多个节点。
		 * ElementList 的实例一旦创建，则不允许修改其成员。
		 */
		ElementList = namespace(".ElementList", 
		
		/// #ifdef SupportIE6
		
		(navigator.isQuirks ? p.Object : Array)
		
		/// #else
		
		/// Array
		
		/// #endif
		
		.extend({
			
			/**
			 * 获取当前集合的元素个数。
			 * @type {Number}
			 * @property
			 */
			length: 0,
	
			/**
			 * 初始化   ElementList  实例。
			 * @param {Array/ElementList} doms 节点集合。
			 * @constructor
			 */
			constructor: function (doms) {
				
				if(doms) {
		
					assert(doms.length !== undefined, 'ElementList.prototype.constructor(doms): 参数 {doms} 必须是一个 NodeList 或 Array 类型的变量。', doms);
					
					var len = this.length = doms.length;
					while(len--)
						this[len] = doms[len];
		
					/// #ifdef SupportIE8
					
					// 检查是否需要为每个成员调用  $ 函数。
					if(!navigator.isStandard)
						o.update(this, $);
						
					/// #endif
				
				}
				
			},
			
			/**
			 * 将参数数组添加到当前集合。
			 * @param {Element/ElementList} value 元素。
			 * @return this
			 */
			concat: function (value) {
				if(value) {
					value = value.length !== undefined ? value : [value];
					for(var i = 0, len = value.length; i < len; i++)
						this.include(value[i]);
				}
				
				return this;
			},
			
			/**
			 * 对每个元素执行 cloneNode, 并返回新的元素的集合。
			 * @param {Boolean} cloneContent 是否复制子元素。
			 * @return {ElementList} 复制后的新元素组成的新集合。
			 */
			cloneNode: function (cloneContent) {
				var i = this.length,
					r = new ElementList();
				while(i--)
					r[i] = this[i].cloneNode(cloneContent);
				return r;
			},
	
			/**
			 * xType
			 */
			xType: "elementlist"
	
		}));
	
	/// #ifdef SupportIE6
	
	if(navigator.isQuirks) {
		map("pop shift", ap, apply(apply(ElementList.prototype, ap), {
			
			push: function() {
				return ap.push.apply(this, o.update(arguments, $));
			},
			
			unshift: function() {
				return ap.unshift.apply(this, o.update(arguments, $));
			}
			
		}));
	}
	
	/// #endif

	map("filter slice splice reverse", function(func) {
		return function() {
			return new ElementList(ap[func].apply(this, arguments));
		};
	}, ElementList.prototype);
	
	/**
	 * 根据 x, y 获取 {x: x y: y} 对象
	 * @param {Number/Point} x
	 * @param {Number} y
	 * @static
	 * @private
	 */
	Point.format = formatPoint;
		
	/**
	 * @class Element
	 */
	apply(e, {
		
		/// #ifdef ElementCore
		
		/**
		 * 转换一个HTML字符串到节点。
		 * @param {String/Element} html 字符。
		 * @param {Element} context 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 是否缓存。
		 * @return {Element/TextNode/DocumentFragment} 元素。
		 * @static
		 */
		parse: function (html, context, cachable) {

			assert.notNull(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');
			
			// 已经是 Element 或  ElementList。
			if(html.xType)
				return html;
			
			if(html.nodeType)
				return new Control(html);

			var div = cache[html];
			
			context = context && context.ownerDocument || document;
			
			assert(context.createElement, 'Element.parse(html, context, cachable): 参数 {context} 必须是 DOM 节点。', context);

			if (div && div.ownerDocument === context) {
				
				// 复制并返回节点的副本。
				div = div.cloneNode(true);
				
			} else {

				// 过滤空格  // 修正   XHTML
				var tag = rTagName.exec(html);

				if (tag) {
					
					assert.isString(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');

					div = context.createElement("div");

					var wrap = wrapMap[tag[1].toLowerCase()] || wrapMap.$default;

					div.innerHTML = wrap[1] + html.trim().replace(rXhtmlTag, "<$1></$2>") + wrap[2];

					// 转到正确的深度
					for (tag = wrap[0]; tag--;)
						div = div.lastChild;

					// 一般使用最后的节点， 如果存在最后的节点，使用父节点。
					// 如果有多节点，则复制到片段对象。
					if(div.lastChild !== div.firstChild) {
						div = new ElementList(div.childNodes);
					} else {
						
						/// #ifdef SupportIE8

						div = $(div.lastChild);

						/// #endif
						
						assert(div, "Element.parse(html, context, cachable): 无法根据 {html} 创建节点。", html);

					}

				} else {

					// 创建文本节点。
					div = context.createTextNode(html);
				}
				
				div = div.xType ? div : new Control(div);
				
				if(cachable !== undefined ? cachable : !rNoClone.test(html)) {
					cache[html] = div.cloneNode(true);
					
					//  特殊属性复制。
					//if (html = e.properties[div.tagName])
					//	cache[html][html] = div[html];
				}

			}
			
			return div;

		},
		
		/// #endif
		
		/// #ifdef ElementManipulation
			
		/**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
		 */
		hasChild: div.compareDocumentPosition ? function (elem, child) {
			assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
			assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
			return !!(elem.compareDocumentPosition(child) & 16);
		} : function (elem, child) {
			assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
			assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
			while(child = child.parentNode)
				if(elem === child)
					return true;
					
			return false;
		},
	
		/**
		 * 特殊属性集合。
		 * @type Object
		 * 特殊的属性，在节点复制时不会被复制，因此需要额外复制这些属性内容。
		 */
		properties: {
			INPUT: 'checked',
			OPTION: 'selected',
			TEXTAREA: 'value'
		},
		
		/// #endif
		
		/// #ifdef ElementTraversing
		
		/**
		 * 用于 get 的名词对象。
		 * @type String
		 */
		treeWalkers: {
	
			// 全部子节点。
			all: 'all' in div ? function (elem, fn) { // 返回数组
				assert.isFunction(fn, "Element.prototype.get('all', args): 参数 {args} ~。");
				var r = new ElementList;
				ap.forEach.call(elem.all, function(elem) {
					if(fn(elem))
						r.push(elem);
				});
				return  r;
			} : function (elem, fn) {
				assert.isFunction(fn, "Element.prototype.get('all', args): 参数 {args} ~。");
				var r = new ElementList, doms = [elem];
				while (elem = doms.pop()) {
					for(elem = elem.firstChild; elem; elem = elem.nextSibling)
						if (elem.nodeType === 1) {
							if (fn(elem))
								r.push(elem);
							doms.push(elem);
						}
				}
				
				return r;
			},
	
			// 上级节点。
			parent: createTreeWalker(true, 'parentNode'),
	
			// 第一个节点。
			first: createTreeWalker(true, 'nextSibling', 'firstChild'),
	
			// 后面的节点。
			next: createTreeWalker(true, 'nextSibling'),
	
			// 前面的节点。
			previous: createTreeWalker(true, 'previousSibling'),
	
			// 最后的节点。
			last: createTreeWalker(true, 'previousSibling', 'lastChild'),
			
			// 全部子节点。
			children: createTreeWalker(false, 'nextSibling', 'firstChild'),
			
			// 最相邻的节点。
			closest: function(elem, args) {
				assert.isFunction(args, "Element.prototype.get('closest', args): 参数 {args} 必须是函数");
				return args(elem) ? elem : this.parent(elem, args);
			},
	
			// 全部上级节点。
			parents: createTreeWalker(false, 'parentNode'),
	
			// 后面的节点。
			nexts: createTreeWalker(false, 'nextSibling'),
	
			// 前面的节点。
			previouses: createTreeWalker(false, 'previousSibling'),
	
			// 奇数个。
			odd: function(elem, args) {
				return this.even(elem, !args);
			},
			
			// 偶数个。
			even: function (elem, args) {
				return this.children(elem, function (elem) {
					return args = !args;
				});
			},
	
			// 兄弟节点。
			siblings: function(elem, args) {
				return this.previouses(elem, args).concat(this.nexts(elem, args));
			},
			
			// 号次。
			index: function (elem) {
				var i = 0;
				while(elem = elem.previousSibling)
					if(elem.nodeType === 1)
						i++;
				return i;
			},
			
			// 偏移父位置。
			offsetParent: function (elem) {
				var me = elem;
				while ( (me = me.offsetParent) && !rBody.test(me.nodeName) && styleString(me, "position") === "static" );
				return $(me || getDocument(elem).body);
			}
	
		},
		
		/// #endif
		
		/// #ifdef ElementAttributes

		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attributes: attributes,

		/**
		 * 获取一个节点属性。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function (elem, name) {

			assert.isNode(elem, "Element.getAttr(elem, name): 参数 {elem} ~。");
			
			// if(navigator.isSafari && name === 'selected' && elem.parentNode) { elem.parentNode.selectIndex; if(elem.parentNode.parentNode) elem.parentNode.parentNode.selectIndex; }
			
			var fix = attributes[name];
			
			// 如果是特殊属性，直接返回Property。
			if (fix) {
				
				if(fix.get)
					return fix.get(elem, name);
					
				assert(!elem[fix] || !elem[fix].nodeType, "Element.getAttr(elem, name): 表单内不能存在 {name} 的元素。", name);

				// 如果 这个属性是自定义属性。
				if(fix in elem)
					return elem[fix];
			}
			
			assert(elem.getAttributeNode, "Element.getAttr(elem, name): 参数 {elem} 不支持 getAttribute。", elem);

			// 获取属性节点，避免 IE 返回属性。
			fix = elem.getAttributeNode(name);
			
			// 如果不存在节点， name 为  null ，如果不存在节点值， 返回     null。
			return fix && (fix.value || null);

		},

		/**
		 * 检查是否含指定类名。
		 * @param {Element} elem 元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function (elem, className) {
			assert.isNode(elem, "Element.hasClass(elem, className): 参数 {elem} ~。");
			assert(className && (!className.indexOf || !/[\s\r\n]/.test(className)), "Element.hasClass(elem, className): 参数 {className} 不能空，且不允许有空格和换行。");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		},
		
		/// #endif
		
		/// #ifdef ElementStyle
		
		/**
		 * 特殊的样式集合。
		 * @property
		 * @type Object
		 * @private
		 */
		styles: styles,
		
		/**
		 * 获取元素的计算样式。
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 */
		getStyle: getStyle,

		/**
		 * 读取样式字符串。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 */
		styleString:  styleString,

		/**
		 * 读取样式数字。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 * @static
		 */
		styleNumber: styleNumber,

		/**
		 * 样式表。
		 * @static
		 * @type Object
		 */
		sizeMap: {},
		
		/**
		 * 显示元素的样式。
		 * @static
		 * @type Object
		 */
		display: { position: "absolute", visibility: "visible", display: "block" },

		/**
		 * 不需要单位的 css 属性。
		 * @static
		 * @type Object
		 */
		styleNumbers: map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', {}, {}),
	
		/**
		 * 默认最大的 z-index 。
		 * @property
		 * @type Number
		 * @private
		 * @static
		 */
		zIndex: 10000,
		
		/**
		 * 清空元素的 display 属性。
		 * @param {Element} elem 元素。
		 */
		show: function (elem) {
			
			// 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
			elem.style.display = '';
			
			// 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
			if(getStyle(elem, 'display') === 'none')
				elem.style.display = p.getData(elem, 'display') || 'block';
		},
		
		/**
		 * 赋予元素的 display 属性 none。
		 * @param {Element} elem 元素。
		 */
		hide: function (elem) {
			var currentDisplay = styleString(elem, 'display');
			if(currentDisplay !== 'none') {
				p.setData(elem, 'display', currentDisplay);
				elem.style.display = 'none';
			}
		},
		
		/**
		 * 获取指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 * @return {Object} 收集的属性。
		 */
		getStyles: function (elem, styles) {
			assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

			var r = {};
			for(var style in styles) {
				r[style] = elem.style[style];
			}
			return r;
		},
		
		/**
		 * 设置指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 */
		setStyles: function (elem, styles) {
			assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

			apply(elem.style, styles);
		},
	
		/// #endif
		
		/// #if defined(ElementDimension) ||  defined(ElementStyle)

		/**
		 * 根据不同的内容进行计算。
		 * @param {Element} elem 元素。
		 * @param {String} type 输入。 一个 type 由多个句子用,连接，一个句子由多个词语用+连接，一个词语由两个字组成， 第一个字可以是下列字符之一: m b p t l r b h w  第二个字可以是下列字符之一: x y l t r b。词语也可以是: outer inner  。 
		 * @return {Number} 计算值。
		 * mx+sx ->  外大小。
		 * mx-sx ->  内大小。
		 */
		getSize: (function() {
			
			var borders = {
					m: 'margin#',
					b: 'border#Width',
					p: 'padding#'
				},
				map = {
					t: 'Top',
					r: 'Right',
					b: 'Bottom',
					l: 'Left'
				},
				init,
				tpl,
				rWord = /\w+/g;
				
			if(window.getComputedStyle) {
				init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
				tpl	= '(parseFloat(c["#"]) || 0)';
			} else {
				init = 'return ';
				tpl	= '(parseFloat(Element.getStyle(e, "#")) || 0)';
			}
			
			/**
			 * 翻译 type。
			 * @param {String} type 输入字符串。
			 * @return {String} 处理后的字符串。
			 */
			function format(type) {
				var t, f = type.charAt(0);
				switch(type.length) {
					
					// borders + map
					// borders + x|y
					// s + x|y
					case 2:
						t = type.charAt(1);
						assert(f in borders || f === 's', "Element.getSize(e, type): 参数 type 中的 " + type + " 不合法");
						if(t in map) {
							t = borders[f].replace('#', map[t]);
						} else {
							return f === 's' ? 'e.offset' + (t === 'x' ? 'Width' : 'Height')  :
									'(' + format(f + (t !== 'y' ? 'l' : 't')) + '+' + 
									format(f + (t === 'x' ? 'r' : 'b')) + ')';
						}
							
						break;
					
					// map
					// w|h
					case 1:
						if(f in map) {
							t = map[f].toLowerCase();
						} else if(f !== 'x' && f !== 'y') {
							assert(f === 'h' || f === 'w', "Element.getSize(elem, type): 参数 type 中的 " + type + " 不合法");
							return 'Element.styleNumber(e,"' + (f === 'h' ? 'height' : 'width') + '")';
						} else {
							return f;	
						}
						
						break;
						
					default:
						t = type;
				}
				
				return tpl.replace('#', t);
			}
			
			return function (elem, type) {
				assert.isElement(elem, "Element.getSize(elem, type): 参数 {elem} ~。");
				assert.isString(type, "Element.getSize(elem, type): 参数 {type} ~。");
				return (e.sizeMap[type] || (e.sizeMap[type] = new Function("e", init + type.replace(rWord, format))))(elem);
			}
		
		})(),
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
		 * @static
		 */
		setMovable: function (elem) {
			assert.isElement(elem, "Element.setMovable(elem): 参数 elem ~。");
			if(!rMovable.test(styleString(elem, "position")))
				elem.style.position = "relative";
		},
		
		/// #endif
		
		/**
		 * 将一个成员附加到 Element 对象和相关类。
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。
		 * @return {Element} this
		 * @static
		 * 对 Element 扩展，内部对 Element ElementList document 皆扩展。
		 * 这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。
		 * 所谓的扩展，即一个类所需要的函数。
		 *
		 *
		 * DOM 方法 有 以下种
		 *
		 *  1,   其它    setText - 执行结果返回 this， 返回 this 。(默认)
		 *  2  getText - 执行结果是数据，返回结果数组。 
		 *  3  getElementById - 执行结果是DOM 或 ElementList，返回  ElementList 包装。
		 *  4   hasClass - 只要有一个返回等于 true 的值， 就返回这个值。
		 * 
		 *
		 *  参数 copyIf 仅内部使用。
		 */
		implement: function (members, listType, copyIf) {

			assert.notNull(members, "Element.implement" + (copyIf ? 'If' : '') + "(members, listType): 参数 {members} ~。");
			
			Object.each(members, function (value, func) {
				
				var i = this.length;
				while(i--) {
					var cls = this[i].prototype;
					if(!copyIf || !cls[func]) {
						
						if(!i) {
							switch (listType) {
								case 2:  //   return array
									value = function () {
										return this.invoke(func, arguments);
									};
									break;
									
								case 3:  //  return ElementList
									value = function () {
										var args = arguments, r = new ElementList;
										this.forEach(function (node) {
											r.concat(node[func].apply(node, args));
										});
										return r;
			
									};
									break;
								case 4: // return if true
									value = function () {
										var me = this, i = -1, item = null;
										while (++i < me.length && !item)
											item = me[i][func].apply(me[i], arguments);
										return item;
									};
									break;
								default:  // return  this
									value = function () {
										var me = this, len = me.length, i = -1;
										while (++i < len)
											me[i][func].apply(me[i], arguments);
										return this;
									};
									
							}
						}
						
						cls[func] = value;
					}
				}
				
				
				
				
			}, [ElementList, Document, e, Control]);
			
			/// #ifdef SupportIE8

			if(ep.$version) {
				ep.$version++;
			}

			/// #endif

			return this;
		},

		/**
		 * 若不存在，则将一个对象附加到 Element 对象。
		 * @static
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。
		 * @param {Number} docType 说明如何复制到 Document 实例。
		 * @return {Element} this
		 */
		implementIf: function (obj, listType) {
			return this.implement(obj, listType, true);
		},
		
		/**
		 * 定义事件。
		 * @param {String} 事件名。
		 * @param {Function} trigger 触发器。
		 * @return {Function} 函数本身
		 * @static
		 * @memberOf Element
		 * 原则 Element.addEvents 可以解决问题。 但由于 DOM 的特殊性，额外提供 defineEvents 方便定义适合 DOM 的事件。
		 * defineEvents 主要解决 3 个问题:
		 * <ol>
		 * <li> 多个事件使用一个事件信息。
		 *      <p>
		 * 	 	 	所有的 DOM 事件的  add 等 是一样的，因此这个函数提供一键定义: JPlus.defineEvents('e1 e2 e3')
		 * 		</p>
		 * </li>
		 *
		 * <li> 事件别名。
		 *      <p>
		 * 	 	 	一个自定义 DOM 事件是另外一个事件的别名。
		 * 			这个函数提供一键定义依赖: JPlus.defineEvents('mousewheel', 'DOMMouseScroll')
		 * 		</p>
		 * </li>
		 *
		 * <li> 事件委托。
		 *      <p>
		 * 	 	 	一个自定义 DOM 事件经常依赖已有的事件。一个事件由另外一个事件触发， 比如 ctrlenter 是在 keyup 基础上加工的。
		 * 			这个函数提供一键定义依赖: JPlus.defineEvents('ctrlenter', 'keyup', function (e) { (判断事件) })
		 * 		</p>
		 * </li>
		 *
		 * @example
		 * <code>
		 *
		 * Element.defineEvents('mousewheel', 'DOMMouseScroll')  //  在 FF 下用   mousewheel
		 * 替换   DOMMouseScroll 。
		 *
		 * Element.defineEvents('mouseenter', 'mouseover', function (e) {
		 * 	  if( !isMouseEnter(e) )   // mouseenter  是基于 mouseover 实现的事件，  因此在 不是
		 * mouseenter 时候 取消事件。
		 *        e.returnValue = false;
		 * });
		 *
		 * </code>
		 */
		addEvents: function (events, baseEvent, initEvent) {
			
			var ee = p.Events.element;
			
			if(Object.isObject(events)) {
				p.Object.addEvents.call(this, events);
				return this;
			}
			
			assert.isString(events, "Element.addEvents(events, baseEvent, initEvent): 参数 {events} ~或对象。");
			
			// 删除已经创建的事件。
			delete ee[events];
			
			assert(!initEvent || ee[baseEvent], "Element.addEvents(events, baseEvent, initEvent): 不存在基础事件 {baseEvent}。");
	
			// 对每个事件执行定义。
			map(events, Function.from(o.extendIf(Function.isFunction(baseEvent) ? {
	
				initEvent: baseEvent
	
			} : {
	
				initEvent: initEvent ? function (e) {
					return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
				} : ee[baseEvent].initEvent,
	
				//  如果存在 baseEvent，定义别名， 否则使用默认函数。
				add: function (elem, type, fn) {
					elem.addEventListener(baseEvent, fn, false);
				},
	
				remove: function (elem, type, fn) {
					elem.removeEventListener(baseEvent, fn, false);
				}
	
			}, ee.$default)), ee);
	
			return e.addEvents;
		},
		
		/**
		 * 获取元素的文档。
		 * @param {Element} elem 元素。
		 * @return {Document} 文档。
		 */
		getDocument: getDocument
		
	})
		
	/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
	
	/**
	 * xType
	 * @type String
	 */
	.implementIf(apply({xType: "element"}, eventObj))
	
	/// #else
	
	/// .implementIf({xType: "element"})
		
	/// #endif
	
	.implement({
	
		/// #ifdef ElementManipulation

		/**
		 * 将当前节点添加到其它节点。
		 * @param {Element/String} elem=document.body 节点、控件或节点的 id 字符串。
		 * @return {Element} this
		 * this.appendTo(parent)  相当于 elem.appendChild(this) 。
		 * appendTo 同时执行  render(parent, null) 通知当前控件正在执行渲染。
		 */
		appendTo: function (parent) {
			
			// 切换到节点。
			parent = parent && parent !== true ? $(parent) : document.body;

			// 插入节点
			return this.render(parent, null);

		},
		
		/**
		 * 将当前列表添加到指定父节点。
		 * @param {Element/Control} parent 渲染的目标。
		 * @param {Element/Control} refNode 渲染的位置。
		 * @protected
		 */
		render: function (parent, refNode) {
			assert(parent && parent.insertBefore, 'Element.prototype.render(parent, refNode): 参数 {parent} 必须是 DOM 节点或控件。', parent);
			assert(refNode || refNode === null, 'Element.prototype.render(parent, refNode): 参数 {refNode} 必须是 null 或 DOM 节点或控件。', refNode);
			return parent.insertBefore(this.dom || this, refNode);
		},

		/**
		 * 删除元素子节点或本身。
		 * @param {Object/Undefined} child 子节点。
		 * @return {Element} this
		 */
		remove: function (child) {
			
			// 没有参数， 删除本身。
			if(!arguments.length)
				return this.detach();
				
			assert(!child || this.hasChild(child), 'Element.prototype.remove(child): 参数 {child} 不是当前节点的子节点', child);
			child.detach ? child.detach() : this.removeChild(child);
			return this;
		},

		/**
		 * 删除一个节点的所有子节点。
		 * @return {Element} this
		 */
		empty: function () {
			var elem = this.dom || this;
			o.each(elem.getElementsByTagName("*"), clean);
			while(elem.lastChild)
				elem.removeChild(elem.lastChild);
			return this;
		},
		
		/**
		 * 移除节点本身。
		 */
		detach: function() {
			var elem = this.dom || this;
			elem.parentNode && elem.parentNode.removeChild(elem);
			return this;
		},

		/**
		 * 释放节点所有资源。
		 */
		dispose: function () {
			var elem = this.dom || this;
			o.each(elem.getElementsByTagName("*"), clean);
			this.detach();
		},
		
		/// #endif
		
		/// #ifdef ElementStyle

		/**
		 * 设置内容样式。
		 * @param {String} name CSS 属性名或 CSS 字符串。
		 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则自动转为像素。
		 * @return {Element} this
		 * setStyle('cssText') 不被支持，需要使用 name， value 来设置样式。
		 */
		setStyle: function (name, value) {

			assert.isString(name, "Element.prototype.setStyle(name, value): 参数 {name} ~。");
			
			// 获取样式
			var me = this;

			//没有键  返回  cssText
			if(name in styles) {
				
				// setHeight  setWidth   setOpacity
				return me[styles[name]](value);

			} else {
				name = name.replace(rStyle, formatStyle);
				
				assert(value || !isNaN(value), "Element.prototype.setStyle(name, value): 参数 {value} 不是正确的属性值。", value);

				//如果值是函数，运行。
				if (typeof value === "number" && !(name in e.styleNumbers))
					value += "px";
				
			}

			// 指定值。
			(me.dom || me).style[name] = value;

			return me;
		},

		/// #ifdef SupportIE8

		/**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
		setOpacity: 'opacity' in div.style ? function (value) {

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

			//  标准浏览器使用   opacity
			(this.dom || this).style.opacity = value;
			return this;

		} : function (value) {

			var elem = this.dom || this, 
				style = elem.style;

			assert(!+value || (value <= 1 && value >= 0), 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);
			
			if(value)
				value *= 100;
			
			value = value || value === 0 ? 'opacity=' + value : '';
			
			// 获取真实的滤镜。
			elem = styleString(elem, 'filter');
			
			assert(!/alpha\([^)]*\)/i.test(elem) || rOpacity.test(elem), 'Element.prototype.setOpacity(value): 当前元素的 {filter} CSS属性存在不属于 alpha 的 opacity， 将导致 setOpacity 不能正常工作。', elem);
			
			// 当元素未布局，IE会设置失败，强制使生效。
			style.zoom = 1;

			// 设置值。
			style.filter = rOpacity.test(elem) ? elem.replace(rOpacity, value) : (elem + ' alpha(' + value + ')');
			
			return this;

		},

		/// #else

		/// setOpacity: function (value) {
		///	
		/// 	assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);
		///
		///     //  标准浏览器使用   opacity
		///     (this.dom || this).style.opacity = value;
		///     return this;
		///
		/// },

		/// #endif

		/**
		 * 显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function (duration, callBack) {
			
			e.show(this.dom || this);
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},

		/**
		 * 隐藏当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function (duration, callBack) {

			e.hide(this.dom || this);
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},

		/**
		 * 切换显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		toggle: function (duration, callBack, type, flag) {
			return this[(flag === undefined ? this.isHidden() : flag) ? 'show' : 'hide']  (duration, callBack, type);
		},

		/**
		 * 设置元素不可选。
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function (value) {

			(this.dom || this).unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function (value) {

			(this.dom || this).onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function (value) {

			(this.dom || this).style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},

		/**
		 * 将元素引到最前。
		 * @param {Element} [elem] 参考元素。
		 * @return this
		 */
		bringToFront: function (elem) {
			
			assert(!elem || (elem.dom  && elem.dom.style) || elem.style, "Element.prototype.bringToFront(elem): 参数 {elem} 必须为 元素或为空。", elem);
			
			var thisElem = this.dom || this,
				targetZIndex = elem && (parseInt(styleString(elem.dom || elem, 'zIndex')) + 1) || e.zIndex++;
			
			// 如果当前元素的 z-index 未超过目标值，则设置
			if(!(styleString(thisElem, 'zIndex') > targetZIndex))
				thisElem.style.zIndex = targetZIndex;
			
			return this;
		},
		
		/// #endif
		
		/// #ifdef ElementAttribute
		
		/**
		 * 设置节点属性。
		 * @param {String} name 名字。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setAttr: function (name, value) {

			var elem = this.dom || this;
			
			/// #ifdef SupportIE6

			assert(name !== 'type' || elem.tagName !== "INPUT" || !elem.parentNode, "Element.prototype.setAttr(name, type): 无法修改INPUT元素的 type 属性。");

			/// #endif

			// 如果是节点具有的属性。
			if (name in attributes) {
				
				if(attributes[name].set)
					attributes[name].set(elem, name, value);
				else {
					
					assert(elem.tagName !== 'FORM' || name !== 'className' || typeof me.className === 'string', "Element.prototype.setAttr(name, type): 表单内不能存在 name='className' 的节点。");
	
					elem[attributes[name]] = value;
				
				}
				
			} else if (value === null) {
				
				assert(elem.removeAttributeNode, "Element.prototype.setAttr(name, type): 当前元素不存在 removeAttributeNode 方法");
				
				if(value = elem.getAttributeNode(name)) {
					value.nodeValue = '';
					elem.removeAttributeNode(value);
				}
			
			} else {
				
				assert(elem.getAttributeNode, "Element.prototype.setAttr(name, type): 当前元素不存在 getAttributeNode 方法");

				var node = elem.getAttributeNode(name);
				
				if(node)
					node.nodeValue = value;
				else
					elem.setAttribute(name, value);
				
			}

			return this;

		},

		/**
		 * 快速设置节点全部属性和样式。
		 * @param {String/Object} name 名字。
		 * @param {Object} [value] 值。
		 * @return {Element} this
		 */
		set: function (name, value) {

			var me = this;

			if (typeof name === "string") {
				
				var elem = me.dom || me;

				// event 。
				if(name.match(rEventName))
					me.on(RegExp.$1, value);

				// css 。
				else if(elem.style && (name in elem.style || rStyle.test(name)))
					me.setStyle(name, value);

				// attr 。
				else
					me.setAttr(name, value);

			} else if(o.isObject(name)) {

				for(value in name)
					me.set(value, name[value]);

			}

			return me;


		},

		/**
		 * 增加类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		addClass: function (className) {
			var elem = this.dom || this;
			
			assert(className && !/[\r\n]/.test(className), "Element.prototype.addClass(className): 参数 {className} 不能空，且不允许有空格和换行。");
			
			elem.className = elem.className ? elem.className + ' ' + className : className;
			
			return this;
		},

		/**
		 * 删除类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		removeClass: function (className) {
			var elem = this.dom || this;
			
			assert(!className || !/[\s\r\n]/.test(className), "Element.prototype.addClass(className): 参数 {className} 不能空，且不允许有空格和换行。");
			
			elem.className = className != null ? elem.className.replace(new RegExp('\\b' + className + '\\b\\s*', "g"), '') : '';
			
			return this;
		},

		/**
		 * 切换类名。
		 * @param {String} className 类名。
		 * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
		 * @return {Element} this
		 */
		toggleClass: function (className, toggle) {
			return (toggle !== undefined ? !toggle : this.hasClass(className)) ? this.removeClass(className) : this.addClass(className);
		},

		/**
		 * 设置值。
		 * @param {String/Boolean} 值。
		 * @return {Element} this
		 */
		setText: function (value) {
			var elem = this.dom || this;
			
			if(elem.nodeType !== 1)
				elem.nodeValue = value;
			else 
				switch(elem.tagName) {
					case "SELECT":
						if(elem.type === 'select-multiple' && value != null) {
							
							assert.isString(value, "Element.prototype.setText(value): 参数  {value} ~。");
						
							value = value.split(',');
							o.each(elem.options, function (e) {
								e.selected = value.indexOf(e.value) > -1;
							});
							
							break;
	
						}
	
					//  继续执行
					case "INPUT":
					case "TEXTAREA":
						elem.value = value;
						break;
					default:
						elem[attributes.innerText] = value;
				}
				
				
			return  this;
		},

		/**
		 * 设置 HTML 。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setHtml: function (value) {
			var elem = this.dom || this,
				map = wrapMap.$default;
			value = (map[1] + value + map[2]).replace(rXhtmlTag, "<$1></$2>");
			
			o.each(elem.getElementsByTagName("*"), clean);
			elem.innerHTML = value;
			if(map[0]) {
				value = elem.lastChild;
				elem.removeChild(elem.firstChild);
				elem.removeChild(value);
				while(value.firstChild)
					elem.appendChild(value.firstChild);
			}
			
			return this;
		},
	
		/// #endif
	
		/// #ifdef ElementDimension

		/**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setSize: function (x, y) {
			var me = this,
				p = formatPoint(x,y);

			if(p.x != null)
				me.setWidth(p.x - e.getSize(me.dom || me, 'bx+px'));
	
			if (p.y != null)
				me.setHeight(p.y - e.getSize(me.dom || me, 'by+py'));
	
			return me;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setWidth: function (value) {

			(this.dom || this).style.width = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
			return this;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setHeight: function (value) {

			(this.dom || this).style.height = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
			return this;
		},
		
		/// #endif
	
		/// #ifdef ElementOffset

		/**
		 * 设置元素的相对位置。
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function (p) {

			assert(o.isObject(p) && 'x' in p && 'y' in p, "Element.prototype.setOffset(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
			var s = (this.dom || this).style;
			s.top = p.y + 'px';
			s.left = p.x + 'px';
			return this;
		},

		/**
		 * 设置元素的固定位置。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setPosition: function (x, y) {
			var me = this, offset = me.getOffset().sub(me.getPosition()), p = formatPoint(x, y);

			if (p.y)
				offset.y += p.y;
				
			if (p.x)
				offset.x += p.x;

			e.setMovable(me.dom || me);

			return me.setOffset(offset);
		},

		/**
		 * 滚到。
		 * @param {Element} dom
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setScroll: function (x, y) {
			var elem = this.dom || this, p = formatPoint(x, y);

			if(p.x != null)
				elem.scrollLeft = p.x;
			if(p.y != null)
				elem.scrollTop = p.y;
			return this;

		}
	
		/// #endif
		
	})
	
	/// #ifdef ElementEvent
	
	.implement(p.IEvent)
	
	/// #endif
	
	.implement({

		/// #ifdef ElementStyle

		/**
		 * 获取节点样式。
		 * @param {String} key 键。
		 * @param {String} value 值。
		 * @return {String} 样式。
		 * getStyle() 不被支持，需要使用 name 来设置样式。
		 */
		getStyle: function (name) {

			assert.isString(name, "Element.prototypgetStyle(name): 参数 {name} ~。");

			var elem = this.dom || this;

			return elem.style[name = name.replace(rStyle, formatStyle)] || getStyle(elem, name);

		},

		/// #ifdef SupportIE8

		/**
		 * 获取透明度。
		 * @method
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
		getOpacity: 'opacity' in div.style ? function () {
			return styleNumber(this.dom || this, 'opacity');
		} : function () {
			return rOpacity.test(styleString(this.dom || this, 'filter')) ? parseInt(RegExp.$1) / 100 : 1;
		},

		/// #else
		///
		/// getOpacity: function () {
		///
		///    return parseFloat(styleString(this.dom || this, 'opacity')) || 0;
		///
		/// },

		/// #endif

		/// #endif

		/// #ifdef ElementAttribute

		/**
		 * 获取一个节点属性。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function (name) {
			return e.getAttr(this.dom || this, name);
		},

		/**
		 * 检查是否含指定类名。
		 * @param {String} className
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function (className) {
			return e.hasClass(this.dom || this, className);
		},

		/**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
		getText: function () {
			var elem = this.dom || this;
			if(elem.nodeType !== 1)
				return elem.nodeValue;

			switch(elem.tagName) {
				case "SELECT":
					if(elem.type != 'select-one') {
						var r = [];
						o.each(elem.options, function (s) {
							if(s.selected && s.value)
								r.push(s.value)
						});
						return r.join(',');
					}

				//  继续执行
				case "INPUT":
				case "TEXTAREA":
					return elem.value;
				default:
					return elem[attributes.innerText];
			}
		},

		/**
		 * 获取值。
		 * @return {String} 值。
		 */
		getHtml: function () {

			return (this.dom || this).innerHTML;
		},
	
		/// #ifdef ElementDimension

		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 */
		getSize: function () {
			var elem = this.dom || this;

			return new Point(elem.offsetWidth, elem.offsetHeight);
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
		getWidth: function () {
			return styleNumber(this.dom || this, 'width');
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
		getHeight: function () {
			return styleNumber(this.dom || this, 'height');
		},

		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function () {
			var elem = this.dom || this;

			return new Point(elem.scrollWidth, elem.scrollHeight);
		},
	
		/// #endif
	
		/// #ifdef ElementOffset

		/**
		 * 获取元素的相对位置。
		 * @return {Point} 位置。
		 */
		getOffset: function () {

			// 如果设置过 left top ，这是非常轻松的事。
			var elem = this.dom || this,
				left = elem.style.left,
				top = elem.style.top;

			// 如果未设置过。
			if (!left || !top) {

				// 绝对定位需要返回绝对位置。
				if(styleString(elem, "position") === 'absolute') {
					top = this.get('offsetParent');
					left = this.getPosition();
					if(!rBody.test(top.nodeName))
						left = left.sub(top.getPosition());
					left.x -= styleNumber(elem, 'marginLeft') + styleNumber(top, 'borderLeftWidth');
					left.y -= styleNumber(elem, 'marginTop') + styleNumber(top,  'borderTopWidth');
					
					return left;
				}

				// 非绝对的只需检查 css 的style。
				left = getStyle(elem, 'left');
				top = getStyle(elem, 'top');
			}

			// 碰到 auto ， 空 变为 0 。
			return new Point(parseFloat(left) || 0, parseFloat(top) || 0);
		},

		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: div.getBoundingClientRect ? function () {

			var elem = this.dom || this,
				bound = elem.getBoundingClientRect(),
				doc = getDocument(elem),
				html = doc.dom,
				htmlScroll = doc.getScroll();

			return new Point(
				bound.left+ htmlScroll.x - html.clientLeft,  // TODO
				bound.top + htmlScroll.y - html.clientTop
			    );
		} : function () {

			var elem = this.dom || this,
				p = new Point(0, 0),
				t = elem.parentNode;
			
			if(styleString(elem, 'position') === 'fixed')
				return new Point(elem.offsetLeft, elem.offsetTop).add(document.getScroll());
			
			while (t && !rBody.test(t.nodeName)) {
				p.x -= t.scrollLeft;
				p.y -= t.scrollTop;
				t = t.parentNode;
			}
			  
			t = elem;

			while (elem && !rBody.test(elem.nodeName)) {
				p.x += elem.offsetLeft ;
				p.y += elem.offsetTop;
				if (navigator.isFirefox) {
					if (styleString(elem, 'MozBoxSizing') !== 'border-box') {
						add(elem);
					}
					var parent = elem.parentNode;
					if (parent && styleString(parent, 'overflow') !== 'visible') {
						add(parent);
					}
				} else if (elem !== t && navigator.isSafari) {
					add(elem);
				}

				if(styleString(elem, 'position') === 'fixed') {
					p = p.add(document.getScroll());
					break;
				}

				elem = elem.offsetParent;
			}
			if (navigator.isFirefox && styleString(t, 'MozBoxSizing') !== 'border-box') {
				p.x -= styleNumber(t, 'borderLeftWidth');
				p.y -= styleNumber(t, 'borderTopWidth');
			}
			
			function add(elem) {
				p.x += styleNumber(elem, 'borderLeftWidth');
				p.y += styleNumber(elem, 'borderTopWidth');
			}
			return p;
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll:  function () {
			var elem = this.dom || this;
			return new Point(elem.scrollLeft, elem.scrollTop);
		}

		/// #endif
		
	}, 2)
	
	.implement({
		
		/// #ifdef ElementTraversing
		
		/**
		 * 执行一个简单的选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		findAll: cssSelector[1],

		/**
		 * 获得相匹配的节点。
		 * @param {String/Function/Number} treeWalker 遍历函数，该函数在 {#link Element.treeWalkers} 指定。
		 * @param {Object} [args] 传递给遍历函数的参数。
		 * @return {Element} 元素。
		 */
		get: function (treeWalker, args) {

			switch (typeof treeWalker) {
				case 'string':
					break;
				case 'function':
					args = treeWalker;
					treeWalker = 'all';
					break;
				case 'number':
					if(treeWalker < 0) {
						args = -treeWalker;
						treeWalker = 'last';
					} else {
						args = treeWalker;
						treeWalker = 'first';
					}
					
			}
			
			assert(Function.isFunction(e.treeWalkers[treeWalker]), 'Element.prototype.get(treeWalker, args): 不支持 {treeWalker}类型 的节点关联。', treeWalker);
			return e.treeWalkers[treeWalker](this.dom || this, args);
		},
	
		/// #endif
		
		/// #ifdef ElementManipulation

		/**
		 * 在某个位置插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {String} [where] 插入地点。 beforeBegin   节点外    beforeEnd   节点里
		 * afterBegin    节点外  afterEnd     节点里
		 * @return {Element} 插入的节点。
		 */
		insert: function (html, where) {

			var elem = this.dom || this, p, refNode = elem;

			assert.isNode(elem, "Element.prototype.insert(html, where): this.dom || this 返回的必须是 DOM 节点。");
			assert(!where || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(where + ' ') != -1, "Element.prototype.insert(html, where): 参数 {where} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", where);
			html = e.parse(html, elem);

			switch (where) {
				case "afterBegin":
					p = this;
					refNode = elem.firstChild;
					break;
				case "afterEnd":
					refNode = elem.nextSibling;
				case "beforeBegin":
					p = elem.parentNode;
					assert(p, "Element.prototype.insert(html, where): 节点无父节点时无法插入 {this}", elem);
					break;
				default:
					assert(!where || where == 'beforeEnd' || where == 'afterBegin', 'Element.prototype.insert(html, where): 参数 {where} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。', where);
					p = this;
					refNode = null;
			}
			
			// 调用 HTML 的渲染。
			return html.render(p, refNode);
		},

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function (html) {
			
			// 如果新元素有适合自己的渲染函数。
			return e.parse(html, this.dom || this).render(this, null);
		},

		/**
		 * 将一个节点用另一个节点替换。
		 * @param {Element/String} html 内容。
		 * @return {Element} 替换之后的新元素。
		 */
		replaceWith: function (html) {
			var elem = this.dom || this;
			
			html = e.parse(html, elem);
			//  assert.isNode(html, "Element.prototype.replaceWith(html): 参数 {html} ~或 html片段。");
			if(elem.parentNode) {
				html.render(elem.parentNode, elem);
				this.dispose();
			}
			return html;
		},
		
		/**
		 * 复制节点。
		 * @param {Boolean} cloneEvent=false 是否复制事件。
		 * @param {Boolean} contents=true 是否复制子元素。
		 * @param {Boolean} keepId=false 是否复制 id 。
		 * @return {Element} 元素。
		 */
		clone: function (cloneEvent, contents, keepId) {

			assert.isElement(this, "Element.prototype.clone(cloneEvent, contents, keepid): this 必须是 nodeType = 1 的 DOM 节点。");
			
			var elem = this,
				clone = elem.cloneNode(contents = contents !== false);

			if (contents)
				for (var elemChild = elem.getElementsByTagName('*'), cloneChild = clone.getElementsByTagName('*'), i = 0; cloneChild[i]; i++)
					cleanClone(elemChild[i], cloneChild[i], cloneEvent, keepId);

			cleanClone(elem, clone, cloneEvent, keepId);

			return clone;
		}
		
		/// #endif

	}, 3)
	
	.implement({
		
		/// #ifdef ElementTraversing
		
		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: cssSelector[0],
		
		/// #endif
		
		/// #ifdef ElementManipulation

		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function (child) {
			var elem = this.dom || this;
			assert.isNode(elem, "Element.prototype.contains(child): this.dom || this 返回的必须是 DOM 节点。");
			assert.notNull(child, "Element.prototype.contains(child):参数 {child} ~。");
			child = child.dom || child;
			return child == elem || e.hasChild(elem, child);
		},

		/**
		 * 判断一个节点是否有子节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		hasChild: function (child) {
			var elem = this.dom || this;
			return child ? e.hasChild(elem, child.dom || child) : elem.firstChild !== null;
		},
		
		/// #endif
		
		/// #ifdef ElementStyle

		/**
		 * 判断一个节点是否隐藏。
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 */
		isHidden: function () {
			var elem = this.dom || this;

			return (elem.style.display || getStyle(elem, 'display')) === 'none';
		}
		
		/// #endif
		
	}, 4);
	
	getWindowScroll = 'pageXOffset' in window ? function () {
		var win = this.defaultView;
		return new Point(win.pageXOffset, win.pageYOffset);
	} : ep.getScroll;
		
	/**
	 * @class Document
	 */
	Document.implement({
		
		/// #ifdef ElementManipulation

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function (html) {
			return $(this.body).append(html);
		},
	
		/// #endif
		
		/// #ifdef ElementCore

		/**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function (tagName, className) {
			
			assert.isString(tagName, 'Document.prototype.create(tagName, className): 参数 {tagName} ~。');

			/// #ifdef SupportIE6

			var div = $(this.createElement(tagName));

			/// #else

			/// var div = this.createElement(tagName);

			/// #endif

			div.className = className;

			return div;
		},
	
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 获取元素可视区域大小。包括 margin 和 border 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getSize: function () {
			var doc = this.dom;

			return new Point(doc.clientWidth, doc.clientHeight);
		},

		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function () {
			var html = this.dom,
				min = this.getSize(),
				body = this.body;
				
				
			return new Point(Math.max(html.scrollWidth, body.scrollWidth, min.x), Math.max(html.scrollHeight, body.scrollHeight, min.y));
		},
		
		/// #ifdef ElementOffset
		
		/// #endif

		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: getWindowScroll,
		
		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll: getWindowScroll,

		/**
		 * 滚到。
		 * @method setScroll
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Document} this 。
		 */
		setScroll: function (x, y) {
			var doc = this, p = formatPoint(x, y);
			if(p.x == null)
				p.x = doc.getScroll().x;
			if(p.y == null)
				p.y = doc.getScroll().y;
			doc.defaultView.scrollTo(p.x, p.y);

			return doc;
		},
		
		/// #endif
		
		/**
		 * 根据元素返回节点。
		 * @param {String} ... 对象的 id 或对象。
		 * @return {ElementList} 如果只有1个参数，返回元素，否则返回元素集合。
		 */
		getDom: function () {
			return arguments.length === 1 ? $(this.getElementById(arguments[0])) :  new ElementList(o.update(arguments, this.getElementById, null, this));
		}
		
	});
	
	/**
	 * @namespace Control
	 */
	apply(Control, {
		
		/**
		 * 基类。
		 */
		base: e,
		
		/**
		 * 将指定名字的方法委托到当前对象指定的成员。
		 * @param {Object} control 类。
		 * @param {String} delegate 委托变量。
		 * @param {String} methods 所有成员名。
		 * @param {Number} type 类型。 1 - 返回本身 2 - 返回委托返回 3 - 返回自己，参数作为控件。 
		 * @param {String} [methods2] 成员。
		 * @param {String} [type2] 类型。
		 * 由于一个控件本质上是对 DOM 的封装， 因此经常需要将一个函数转换为对节点的调用。
		 */
		delegate: function(control, target, methods, type, methods2, type2) {
			
			if (methods2) 
				Control.delegate(control, target, methods2, type2);
			
			assert(control && control.prototype, "Control.delegate(control, target, methods, type, methods2, type2): 参数 {control} 必须是一个类", control);
			assert.isNumber(type, "Control.delegate(control, target, methods, type, methods2, type2): 参数 {type} ~。");
			
			map(methods, function(func) {
				switch (type) {
					case 2:
						return function(args1, args2, args3) {
							return this[target][func](args1, args2, args3);
						};
					case 3:
						return function(args1, args2) {
							return this[target][func](args1 && args1.dom || args1, args2 ? args2.dom || args2 : null);
						};
					default:
						return function(args1, args2, args3) {
							this[target][func](args1, args2, args3);
							return this;
						};
				}
			}, control.prototype);
			
			return Control.delegate;
		}
		
	});
	
	Control.delegate(Control, 'dom', 'addEventListener removeEventListener scrollIntoView focus blur', 2, 'appendChild removeChild insertBefore replaceChild', 3);
	
	/**
	 * 将当前列表添加到指定父节点。
	 * @param {Element/Control} parent 渲染的目标。
	 * @param {Element/Control} refNode 渲染的位置。
	 * @protected
	 */
	ElementList.prototype.render = function (parent, refNode) {
			parent = parent.dom || parent;
			for(var i = 0, len = this.length; i < len; i++)
				parent.insertBefore(this[i], refNode);
	};

	/// #ifdef ElementCore
	
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	/// #endif
		
	/// #ifdef ElementNode
	
	map('checked disabled selected', function (treeWalker) {
		return function(elem, args) {
			args = args !== false;
			return this.children(elem, function (elem) {
				return elem[treeWalker] !== args;
			});
		};
	}, e.treeWalkers);
	
	/// #endif
	
	/**
	 * 获取节点本身。
	 */
	document.dom = document.documentElement;
	
	/// #ifdef SupportIE8

	if (navigator.isStandard) {

	/// #endif
		
		/// #ifdef ElementEvent
		
		window.Event.prototype.stop = pep.stop;

		initMouseEvent = initKeyboardEvent = initUIEvent = function (e) {

			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

		};
		
		/// #endif

	/// #ifdef SupportIE8
		
	} else {
		
		ep.$version = 1;
		
		$ = function (id) {
			
			// 获取节点本身。
			var dom = getElementById(id);
	
			// 把 Element 成员复制到节点。
			// 根据 $version 决定是否需要拷贝，这样保证每个节点只拷贝一次。
			if(dom && dom.nodeType === 1 && dom.$version !== ep.$version)
				o.extendIf(dom, ep);
	
			return dom;
			
		};
		
		/**
		 * 返回当前文档默认的视图。
		 * @type {Window}
		 */
		document.defaultView = document.parentWindow;
		
		/// #ifdef ElementEvent
		
		initUIEvent = function (e) {
			if(!e.stop) {
				e.target = $(e.srcElement);
				e.stopPropagation = pep.stopPropagation;
				e.preventDefault = pep.preventDefault;
				e.stop = pep.stop;
			}
		};

		// mouseEvent
		initMouseEvent = function (e) {
			if(!e.stop) {
				initUIEvent(e);
				e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
				var dom = getDocument(e.target).dom;
				e.pageX = e.clientX + dom.scrollLeft;
				e.pageY = e.clientY + dom.scrollTop;
				e.layerX = e.x;
				e.layerY = e.y;
				//  1 ： 单击  2 ：  中键点击 3 ： 右击
				e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
			
			}
		};

		// keyEvents
		initKeyboardEvent = function (e) {
			if(!e.stop) {
				initUIEvent(e);
				e.which = e.keyCode;
			}
		};
	
		e.properties.OBJECT = 'outerHTML';

		try {
	
			//  修复IE6 因 css 改变背景图出现的闪烁。
			document.execCommand("BackgroundImageCache", false, true);
		} catch(e) {
	
		}
	
		/// #endif
		
	}
	
	/// #endif
	
	apply(p, {
	
		$: $,
		
		/**
		 * 元素。
		 */	
		Element: e,
		
		/// #ifdef ElementEvent
		
		/**
		 * 表示事件的参数。
		 * @class JPlus.Event
		 */
		Event: Class(pep),
		
		/// #endif
		
		/**
		 * 文档。
		 */
		Document: Document
			
	});
	
	map("$ Element Event Document", p, window, true);
		
	/// #ifdef ElementAttribute
	
	//  下列属性应该直接使用。
	map("checked selected disabled value innerHTML textContent className autofocus autoplay async controls hidden loop open required scoped compact nowrap ismap declare noshade multiple noresize defer readOnly tabIndex defaultValue accessKey defaultChecked cellPadding cellSpacing rowSpan colSpan frameBorder maxLength useMap contentEditable", function (value) {
		attributes[value.toLowerCase()] = attributes[value] = value;
	});
	
	if(!navigator.isStandard) {
		
		attributes.style = {
			
			get: function (elem, name) {
				return elem.style.cssText.toLowerCase();
			},
			
			set: function(elem, name, value) {
				elem.style.cssText = value;
			}
			
		};
		
		if(navigator.isQuirks) {
		
			attributes.value = {
				
				node: function(elem, name) {
					assert(elem.getAttributeNode, "Element.prototype.getAttr(name, type): 当前元素不存在 getAttributeNode 方法");
					return elem.tagName === 'BUTTON' ? elem.getAttributeNode(name) || {value: ''} : elem;
				},
				
				get: function (elem, name) {
					return this.node(elem, name).value;
				},
				
				set: function(elem, name, value) {
					this.node(elem, name).value = value || '';
				}
				
			};
		
			attributes.href = attributes.src = attributes.usemap = {
				
				get: function (elem, name) {
					return elem.getAttribute(name, 2);
				},
				
				set: function(elem, name, value) {
					elem.setAttribute(name, value);
				}
				
			};
			
		}
		
	}
	
	
	/// #endif
	
	/// #ifdef ElementStyle
	
	if(!('opacity' in div.style)) {
		styles.opacity = 'setOpacity';
	}
	
	/// #endif
		
	/// #ifdef ElementEvent
	
	/**
	 * 默认事件。
	 * @type Object
	 * @hide
	 */
	namespace("JPlus.Events.element.$default", {

		/**
		 * 创建当前事件可用的参数。
		 * @param {Object} elem 对象。
		 * @param {Event} e 事件参数。
		 * @param {Object} target 事件目标。
		 * @return {Event} e 事件参数。
		 */
		trigger: function (elem, type, fn, e) {
			return fn(e = new p.Event(elem, type, e)) && (!elem[type = 'on' + type] || elem[type](e) !== false);
		},

		/**
		 * 事件触发后对参数进行处理。
		 * @param {Event} e 事件参数。
		 */
		initEvent: Function.empty,

		/**
		 * 添加绑定事件。
		 * @param {Object} elem 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		add: function (elem, type, fn) {
			elem.addEventListener(type, fn, false);
		},

		/**
		 * 删除事件。
		 * @param {Object} elem 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		remove: function (elem, type, fn) {
			elem.removeEventListener(type, fn, false);
		}

	});

	e.addEvents
		("mousewheel blur focus focusin focusout scroll change select submit error load unload", initUIEvent)
		("click dblclick DOMMouseScroll mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", initMouseEvent)
		("keydown keypress keyup", initKeyboardEvent);

	if (navigator.isFirefox)
		e.addEvents('mousewheel', 'DOMMouseScroll');

	if (!navigator.isIE)
		e.addEvents
			('mouseenter', 'mouseover', checkMouseEnter)
			('mouseleave', 'mouseout', checkMouseEnter);
	
	/// #endif
	
	/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
	
	o.extendIf(window, eventObj);
		
	/// #endif
	
	/// #ifdef ElementDomReady
		
	map('Ready Load', function (ReadyOrLoad, isLoad) {
	
		var readyOrLoad = ReadyOrLoad.toLowerCase(),
			isReadyOrLoad = isLoad ? 'isReady' : 'isLoaded';
			
		//  设置 onReady  Load
		document['on' + ReadyOrLoad] = function (fn) {
			
			// 忽略参数不是函数的调用。
			if(!Function.isFunction(fn))
				fn = 0;
			
			// 如果已载入，则直接执行参数。
			if(document[isReadyOrLoad]) {
				
				if(fn) fn.call(document);
			
			// 如果参数是函数。
			} else if(fn) {
				
				document.on(readyOrLoad, fn);
			
			// 触发事件。
			// 如果存在 JS 之后的 CSS 文件， 肯能导致 document.body 为空，此时延时执行 DomReady
			} else if(document.body) {
				
				// 如果 isReady, 则删除
				if(isLoad) {
					
					// 使用系统文档完成事件。
					fn = [window, readyOrLoad];
					
					// 确保  ready 触发。
					document.onReady();
					
				} else {
					
					fn = [document, domReady];
				}
				
				fn[0].removeEventListener(fn[1], arguments.callee, false);
				
				// 触发事件。
				if(document.trigger(readyOrLoad)) {
				
					// 先设置为已经执行。
					document[isReadyOrLoad] = true;
					
					// 删除事件。
					document.un(readyOrLoad);
					
				}
			} else {
				setTimeout(arguments.callee, 1);
			}
			
			return document;
		};
	});
	
	/**
	 * 页面加载时执行。
	 * @param {Functon} fn 执行的函数。
	 * @member document.onReady
	 */
	
	/**
	 * 在文档载入的时候执行函数。
	 * @param {Functon} fn 执行的函数。
	 * @member document.onLoad
	 */
		
	// 如果readyState 不是  complete, 说明文档正在加载。
	if (document.readyState !== "complete") { 

		// 使用系统文档完成事件。
		document.addEventListener(domReady, document.onReady, false);
	
		window.addEventListener('load', document.onLoad, false);
		
		/// #ifdef SupportIE8
		
		// 只对 IE 检查。
		if (!navigator.isStandard) {
		
			// 来自 jQuery

			//   如果是 IE 且不是框架
			var topLevel = false;

			try {
				topLevel = window.frameElement == null;
			} catch(e) {}

			if ( topLevel && document.documentElement.doScroll) {
				
				/**
				 * 为 IE 检查状态。
				 * @private
				 */
				(function () {
					if (document.isReady) {
						return;
					}
				
					try {
						//  http:// javascript.nwbox.com/IEContentLoaded/
						document.documentElement.doScroll("left");
					} catch(e) {
						setTimeout( arguments.callee, 1 );
						return;
					}
				
					document.onReady();
				})();
			}
		}
		
		/// #endif
		
	} else {
		setTimeout(document.onLoad, 1);
	}
	
	/// #endif
	
	/**
	 * @class
	 */

	/**
	 * 根据一个 id 或 对象获取节点。
	 * @param {String/Element} id 对象的 id 或对象。
	 * @return {Element} 元素。
	 */
	function getElementById(id) {
		return typeof id == "string" ? document.getElementById(id) : id;
	}
	
	/**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
	 * @return {Document} 文档。
	 */
	function getDocument(elem) {
		assert(elem && (elem.nodeType || elem.setInterval), 'Element.getDocument(elem): 参数 {elem} 必须是节点。' , elem);
		return elem.ownerDocument || elem.document || elem;
	}
	
	/// #ifdef ElementTraversing
	
	/**
	 * 返回简单的遍历函数。
	 * @param {Boolean} getFirst 返回第一个还是返回所有元素。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
	function createTreeWalker(getFirst, next, first) {
		first = first || next;
		return getFirst ? function(elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first];
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					return $(node);
				node = node[next];
			}
			return node;
		} : function (elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first],
				r = new ElementList;
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					r.push(node);
				node = node[next];
			}
			return r;
		};
	}
	
	/// #ifdef SupportIE6

	/**
	 * 简单的CSS选择器引擎。
	 * 只为 IE6/7 FF 2  等老浏览器准备。
	 * 代码最短优先，效率不高。
	 */
	function CssSelector() {
		
		/**
		 *  属性操作符，#表示值。
		 */
		var attrs = {
				'=': '===#',
				'^=': '.indexOf(#)===0',
				'*=': '.indexOf(#)>=0',
				'|=': '.split(/\\b+/).indexOf(#)===0',
				'~=': '.split(/\\b+/).indexOf(#)>=0'
			},
			
			/**
			 * 连接符转为代码。
			 */
			maps = {
				'': 't=c[i].getElementsByTagName("*");j=0;while(_=t[j++])',
				'>': 'for(_=c[i].firstChild;_;_=_.nextSibling)',
				'~': 'for(_=c[i];_;_=_.nextSibling)',
				'+': 'for(_=c[i];_&&_.nodeType !== 1;_=_.nextSibling);if(_)'
			},
			
			/**
			 * 基本选择器。
			 */
			tests = {
				'.': 'Element.hasClass(_,#)',
				'#': '_.id===#',
				'': '_.tagName===#.toUpperCase()'
			},
			
			/**
			 * find 查询函数缓存。
			 */
			findCache = {},
			
			/**
			 * findAll 查询函数缓存。
			 */
			findAllCache = {},
			
			/**
			 * 用于提取简单部分的正式表达式。
			 * 
			 * 一个简单的表达式由2个部分组成。
			 * 前面部分可以是
			 * 	#id
			 * 	.className
			 * 	tagName
			 * 
			 * 后面部分可以是
			 * 	(任意空格)
			 * 	#
			 * 	.
			 * 	>
			 * 	+
			 * 	~
			 * 	[
			 * 	,
			 * 
			 * 并不是全部选择器都是简单选择器。下列情况是复杂的表达式。
			 *  >
			 *  +
			 *  ~
			 * 	,
			 * 	[attrName]
			 *  [attrName=attrVal]
			 *  [attrName='attrVal']
			 *  [attrName="attrVal"]
			 */
			rSimpleSelector = /^\s*([#.]?)([*\w\u0080-\uFFFF_-]+)(([\[#.>+~,])|\s*)/,
			
			/**
			 * 复杂的表达式。
			 * 
			 * 只匹配 > + ~ , [ 开头的选择器。其它选择器被认为非法表达式。
			 * 
			 * 如果是 [ 开头的表达式， 则同时找出 [attrName] 后的内容。
			 */
			rRelSelector = /^\s*([>+~,]|\[([^=]+?)\s*(([\^\*\|\~]?=)\s*('([^']*?)'|"([^"]*?)"|([^'"][^\]]*?))\s*)?\])/;
	
		/**
		 * 分析选择器，并返回一个等价的函数。
		 * @param {String} selector css3 选择器。
		 * @return {Function} 返回执行选择器的函数。函数的参数是 elem, 表示当前的元素。
		 * 只支持下列选择器及组合：
		 * #id
		 * .class
		 * tagName
		 * [attr]
		 * [attr=val]  (val 可以是单引号或双引号或不包围的字符串，但不支持\转义。)
		 * [attr!=val]
		 * [attr~=val]
		 * [attr^=val]
		 * [attr|=val]
		 * 
		 * 选择器组合方式有：
		 * selctor1selctor2
		 * selctor1,selctor2
		 * selctor1 selctor2
		 * selctor1>selctor2
		 * selctor1~selctor2
		 * selctor1+selctor2
		 */
		function parse(selector, first) {
		
			// filter       0   - 对已有元素进行过滤
			// seperator    1   - 计算分隔操作
			
			var type,
				value,
				tokens = [[1, '']],
				matchSize,
				match,
				codes = ['var c=[e],n,t,i,j,_;'],
				i,
				matchCount = 0;
			
			// 只要还有没有处理完的选择器。
			while(selector) {
				
				// 执行简单的选择器。
				match = rSimpleSelector.exec(selector);
				
				// 如果不返回 null, 说明这是简单的选择器。
				// #id .class tagName 选择器 会进入if语句。
				if(match) {
					
					// 记录当前选择器已被处理过的部分的长度。
					matchSize = match[0].length;
					
					// 条件。
					type = 0;
					
					// 选择器的内容部分， 如 id class tagName
					value = tests[match[1]].replace('#', toJsString(match[2]));
					
					// 如果之后有 . # > + ~ [, 则回退一个字符，下次继续处理。
					if(match[4]) {
						matchSize--;
						
					} else {
						
						// 保存当前的值，以追加空格。
						tokens.push([type, value]);
						
						// 如果末尾有空格，则添加，否则说明已经是选择器末尾，跳出循环:)。
						if(match[3]) {
							type = 1;
							value = '';
						} else {
							selector = null;
							break;
						}
					}
				} else {
					
					// 处理 ~ + > [ ,  开头的选择器， 不是这些开头的选择器是非法选择器。
					match = rRelSelector.exec(selector);
					
					assert(match, "CssSelector.parse(selector): 选择器语法错误(在 " + selector + ' 附近)');
					
					// 记录当前选择器已被处理过的部分的长度。
					matchSize = match[0].length;
					
					// [ 属性 ]
					if(match[2]) {
						type = 0;
						value = 'Element.getAttr(_,' + toJsString(match[2]) + ')';
						if(match[4])
							value = '(' + value + '||"")' + attrs[match[4]].replace('#', toJsString(match[8] || match[6]));
					
					// + > ~
					} else if(match[1] === ',') {
						selector = selector.substring(matchSize);
						break;
					} else {
						type = 1;
						value = match[1];
					}
				}
				
				// 忽略多个空格。
				if(type === 1 && tokens.item(-1) + '' === '1,')
				 	tokens.pop();
				
				// 经过处理后， token 的出现顺序为  0 1 1 0 1 1...
				tokens.push([type, value]);
					
				// 去掉已经处理的部分。
				selector = selector.substring(matchSize);
			
			}
			
			// 删除最后多余的空格。
			if(tokens.item(-1) + '' === '1,')
				tokens.pop();
		
			 // 计算  map 的个数。
			i = match = matchSize = 0;
			
			if(first)
				while(value = tokens[i++])
					matchSize += value[0];
			
			// 从第一个 token 开始，生成代码。
			while(value = tokens[match++]) {

				// 是否只需第一个元素。
				type = ++matchCount == matchSize;
				
				// 如果返回列表，则创建列表。
				if(!type)
					codes.push('n=new ElementList;');
				
				if(matchCount === 2) {
					codes.push('if((_=e)');
					
					for(i = match - 1; --i;)
						codes.push('&&', tokens[i][1]);
					
					codes.push(')c.include(_);');
				
				}
				
				// 加入遍历现在集合的代码。
				codes.push(
					'for(i=0;i<c.length;i++) {',
						maps[value[1]]
					);
				
				codes.push('if(_.nodeType===1');
				
				// 处理条件。
				
				// 如果有条件则处理。
				while(tokens[match] && tokens[match][0] === 0)
					codes.push('&&', tokens[match++][1]);
				
				codes.push(')');
				
				codes.push(type ? 'return JPlus.$(_);}': 'n.include(_);}c=n;');
			
			}
			  
			 codes.push('return ');
			if(selector)
				codes.push(type ? '(Element.CssSelector[0].call(e,' : 'c.concat(Element.CssSelector[1].call(e,', toJsString(selector), '))');
			else
				codes.push(type ? 'null' : 'c');
			
			//trace.info(tokens);    
			//  trace.info(codes.join('      '));
				
			return new Function('e', codes.join(''));
		}
		
		/**
		 * 把一个字符串转为Javascript的字符串。
		 * @param {String} value 输入的字符串。
		 * @return {String} 带双引号的字符串。
		 */
		function toJsString (value) {
			return '"' + value.replace(/"/g, '\\"') + '"';
		}
		
		return e.CssSelector = [
			
			function(selector) {
				return (findCache[selector] || (findCache[selector] = parse(selector, true)))(this.dom || this);
			},
			
			function(selector) {
				return (findAllCache[selector] || (findAllCache[selector] = parse(selector)))(this.dom || this);
			}
		];
	}

	/**
	 * 获取一个选择器。
	 * @param {Number/Function/String} args 参数。
	 * @return {Funtion} 函数。
	 */
	function getFilter(args) {
		switch(typeof args) {
			case 'number':
				return function (elem) {
					return --args < 0;
				};
			case 'string':
				args = args.toUpperCase();
				return function (elem) {
					return elem.tagName === args;
				};
		}
		
		assert.isFunction(args, "Element.prototype.get(treeWalker, args): 参数 {fn} 必须是一个函数、空、数字或字符串。", args);
		return args;
	}
	
	/// #endif
	
	/// #endif
	
	/// #ifdef ElementManipulation

	/**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} cloneEvent=true 是否复制数据。
	 * @param {Boolean} keepId=false 是否留下ID。
	 * @return {Element} 元素。
	 */
	function cleanClone(srcElem, destElem, cloneEvent, keepId) {
		
		if (!keepId)
			destElem.removeAttribute('id');

		/// #ifdef SupportIE8

		if(destElem.clearAttributes) {
			
			// IE 会复制 自定义事件， 清楚它。
			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			// 在 IE delete destElem.$data  出现异常。
			destElem.removeAttribute("$data");


			if (srcElem.options)
				o.update(srcElem.options, 'selected', destElem.options, true);
		}

		/// #endif

		if (cloneEvent !== false)
			p.cloneEvent(srcElem, destElem);

		//  特殊属性复制。
		if (keepId = e.properties[srcElem.tagName])
			destElem[keepId] = srcElem[keepId];
	}
	
	/**
	 * 清除节点的引用。
	 * @param {Element} elem 要清除的元素。
	 */
	function clean(elem) {
		
		//  删除自定义属性。
		if (elem.clearAttributes)
			elem.clearAttributes();

		// 删除事件。
		p.IEvent.un.call(elem);
		
		// 删除句柄，以删除双重的引用。
		if(elem.$data)
			elem.$data = null;
		
	}
	
	/// #endif
	
	/// #ifdef ElementEvent
	
	/**
	 * 判断发生事件的元素是否在当前鼠标所在的节点内。
	 * @param {Event} e 事件对象。
	 * @return {Boolean} 返回是否应该触发  mouseenter。
	 */
	function checkMouseEnter(event) {
		
		return this !== event.relatedTarget && !e.hasChild(this, event.relatedTarget);

		/*var parent = e.relatedTarget;
		while (parent) {
			
			if(parent === this)
				return false;
				
			parent = parent.parentNode;
		}
*/
	}
	
	/// #endif
	
	/// #ifdef ElementAttribute
	
    /**
     * 到骆驼模式。
     * @param {String} all 全部匹配的内容。
     * @param {String} match 匹配的内容。
     * @return {String} 返回的内容。
     */
    function formatStyle(all, match) {
        return match ? match.toUpperCase() : styleFloat;
    }
	
	/// #endif
	
	/// #ifdef ElementStyle
	
	/**
	 * 读取样式字符串。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。
	 * @return {String} 字符串。
	 */
	function styleString(elem, name) {
		assert.isElement(elem, "Element.styleString(elem, name): 参数 {elem} ~。");
		return elem.style[name] || getStyle(elem, name);
	}

	/**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
	function styleNumber(elem, name) {
		assert.isElement(elem, "Element.styleNumber(elem, name): 参数 {elem} ~。");
		var value = parseFloat(elem.style[name]);
		if(!value && value !== 0) {
			value = parseFloat(getStyle(elem, name));
			
			if(!value && value !== 0) {
				if(name in styles) {
					var style = e.getStyles(elem, e.display);
					e.setStyles(elem, e.display);
					value = parseFloat(getStyle(elem, name)) || 0;
					e.setStyles(elem, style);
				} else {
					value = 0;
				}
			}
		}
		
		return value;
	}
	
	/// #endif
	
	/**
	 * 转换参数为标准点。
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	function formatPoint(x, y) {
		return x && typeof x === 'object' ? x : {
			x:x,
			y:y
		};
	}

})(this);


//===========================================
//  特效的基类
//  A: xuld
//===========================================


(function(){
	
	
	/// #region interval
	
	var cache = {};
	
	/**
	 * 定时执行的函数。
	 */
	function interval(){
		var i = this.length;
		while(--i >= 0)
			this[i].step();
	}
	
	/// #endregion
		
	/**
	 * @namespace Fx
	 */
	namespace(".Fx.", {
		
		/**
		 * 实现特效。
		 * @class Fx.Base
	 	 * @abstract
		 */
		Base: Class({
		
			/**
			 * 每秒的运行帧次。
			 * @type {Number}
			 */
			fps: 50,
			
			/**
			 * 总运行时间。 (单位:  毫秒)
			 * @type {Number}
			 */
			duration: 500,
			
			/**
			 * 在特效运行时，第二个特效的执行方式。 可以为 'ignore' 'cancel' 'wait' 'restart' 'replace'
			 * @type {String}
			 */
			link: 'ignore',
			
			/**
			 * xType
			 * @type {String}
			 */
			xType: 'fx',
			
			/**
			 * 初始化当前特效。
			 * @param {Object} options 选项。
			 */
			constructor: function() {
				this._competeListeners = [];
			},
			
			/**
			 * 实现变化。
			 * @param {Object} p 值。
			 * @return {Object} p 变化值。
			 */
			transition: function(p) {
				return -(Math.cos(Math.PI * p) - 1) / 2;
			},
			
			/**
			 * 当被子类重写时，实现生成当前变化所进行的初始状态。
			 * @param {Object} from 开始位置。
			 * @param {Object} to 结束位置。
			 * @return {Base} this
			 */
			compile: function(from, to) {
				var me = this;
				me.from = from;
				me.to = to;
				return me;
			},
			
			/**
			 * 进入变换的下步。
			 */
			step: function() {
				var me = this, time = Date.now() - me.time;
				if (time < me.duration) {
					me.set(me.transition(time / me.duration));
				}  else {
					me.set(1);
					me.complete();
				}
			},
			
			/**
			 * 根据指定变化量设置值。
			 * @param {Number} delta 变化量。 0 - 1 。
			 * @abstract
			 */
			set: Function.empty,
			
			/**
			 * 增加完成后的回调工具。
			 * @param {Function} fn 回调函数。
			 */
			onReady: function(fn){
				assert.isFunction(fn, "Fx.Base.prototype.onReady(fn): 参数 {fn} ~。    ");
				this._competeListeners.unshift(fn);	
				return this;
			},
			
			/**
			 * 检查当前的运行状态。
			 * @param {Object} from 开始位置。
			 * @param {Object} to 结束位置。
			 * @param {Number} duration=-1 变化的时间。
			 * @param {Function} [onStop] 停止回调。
			 * @param {Function} [onStart] 开始回调。
			 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
			 * @return {Boolean} 是否可发。
			 */
			delay: function() {
				var me = this, args = arguments;
				
				//如正在运行。
				if(me.timer){
					switch (args[5] || me.link) {
						
						// 链式。
						case 'wait':
							this._competeListeners.unshift(function() {
								
								this.start.apply(this, args);
								return false;
							});
							
							//  如当前fx完成， 会执行 _competeListeners 。
							
							//  [新任务开始2, 新任务开始1]
							
							//  [新任务开始2, 回调函数] 
							
							//  [新任务开始2]
							
							//  []
							
							return false;
							
						case 'restart':
							me.pause();
							while(me._competeListeners.pop());
							break;
							
						// 停掉目前项。
						case 'cancel':
							me.stop();
							break;
							
						case 'replace':
							me.pause();
							break;
							
						// 忽视新项。
						default:
							return false;
					}
				}
				
				return true;
			},
			
			/**
			 * 开始运行特效。
			 * @param {Object} from 开始位置。
			 * @param {Object} to 结束位置。
			 * @param {Number} duration=-1 变化的时间。
			 * @param {Function} [onStop] 停止回调。
			 * @param {Function} [onStart] 开始回调。
			 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
			 * @return {Base} this
			 */
			start: function() {
				var me = this, args = arguments;
				
				if (!me.timer || me.delay.apply(me, args)) {
					
					// 如果 duration > 0  更新。
					if (args[2] > 0) this.duration = args[2];
					
					// 如果有回调， 加入回调。
					if (args[3]) {
						assert.isFunction(args[3], "Fx.Base.prototype.start(from, to, duration, onStop, onStart, link): 参数 {callback} ~。      ");
						me._competeListeners.push(args[3]);
					}
					
					if (args[4] && args[4].apply(me, args) === false) {
						return me.complete();
					}
				
					// 设置时间
					me.time = 0;
					
					me.compile(args[0], args[1]).set(0);
					me.resume();
				}
				return me;
			},
			
			/**
			 * 完成当前效果。
			 */
			complete: function() {
				var me = this;
				me.pause();
				var handlers = me._competeListeners;
				while(handlers.length)  {
					if(handlers.pop().call(me) === false)
						return me;
				}
				
				return me;
			},
			
			/**
			 * 中断当前效果。
			 */
			stop: function() {
				var me = this;
				me.set(1);
				me.pause();
				return me;
			},
			
			/**
			 * 暂停当前效果。
			 */
			pause: function() {
				var me = this;
				if (me.timer) {
					me.time = Date.now() - me.time;
					var fps = me.fps, value = cache[fps];
					value.remove(me);
					if (value.length === 0) {
						clearInterval(me.timer);
						delete cache[fps];
					}
					me.timer = undefined;
				}
				return me;
			},
			
			/**
			 * 恢复当前效果。
			 */
			resume: function() {
				var me = this;
				if (!me.timer) {
					me.time = Date.now() - me.time;
					var fps = me.fps, value = cache[fps];
					if(value){
						value.push(me);
						me.timer = value[0].timer;
					}else{
						me.timer = setInterval(Function.bind(interval, cache[fps] = [me]), Math.round(1000 / fps ));
					}
				}
				return me;
			}
			
		}),
		
		/**
		 * 常用计算。
		 * @param {Object} from 开始。
		 * @param {Object} to 结束。
		 * @param {Object} delta 变化。
		 */
		compute: function(from, to, delta){
			return (to - from) * delta + from;
		}
	
	});
	

})();

//===========================================
//  通过改变CSS实现的变换
//  A: xuld
//===========================================




using("System.Dom.Element");
using("System.Fx.Base");


(function(p){
	
	
	/// #region 字符串扩展
	
	/**
	 * 表示 十六进制颜色。
	 * @type RegExp
	 */
	var rhex = /^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})$/i,
	
		/**
		 * 表示 RGB 颜色。
		 * @type RegExp
		 */
		rRgb = /(\d+),\s*(\d+),\s*(\d+)/;
	
	/**
	 * @namespace String
	 */
	Object.extend(String, {
		
		/**
		 * 把十六进制颜色转为 RGB 数组。
		 * @param {String} hex 十六进制色。
		 * @return {Array} rgb RGB 数组。
		 */
		hexToArray: function(hex){
			assert.isString(hex, "String.hexToArray(hex): 参数 {hex} ~。");
			if(hex == 'transparent')
				return [255, 255, 255];
			var m = hex.match(rhex);
			if(!m)return null;
			var i = 0, r = [];
			while (++i <= 3) {
				var bit = m[i];
				r.push(parseInt(bit.length == 1 ? bit + bit : bit, 16));
			}
			return r;
		},
		
		/**
		 * 把 RGB 数组转为数组颜色。
		 * @param {Array} rgb RGB 数组。
		 * @return {Array} rgb RGB 数组。
		 */
		rgbToArray: function(rgb){
			assert.isString(rgb, "String.rgbToArray(rgb): 参数 {rgb} ~。");
			var m = rgb.match(rRgb);
			if(!m) return null;
			var i = 0, r = [];
			while (++i <= 3) {
				r.push(parseInt(m[i]));
			}
			return r;
		},
		
		/**
		 * 把 RGB 数组转为十六进制色。
		 * @param {Array} rgb RGB 数组。
		 * @return {String} hex 十六进制色。
		 */
		arrayToHex: function(rgb){
			assert.isArray(rgb, "String.arrayToHex(rgb): 参数 {rgb} ~。");
			var i = -1, r = [];
			while(++i < 3) {
				var bit = rgb[i].toString(16);
				r.push((bit.length == 1) ? '0' + bit : bit);
			}
			return '#' + r.join('');
		}
	});
	
	/// #endregion
	
	/**
	 * Element 简写。
	 * @type Element
	 */
	var e = Element,
	
		Fx = p.Fx,
		
		/**
		 * compute 简写。
		 * @param {Object} from 从。
		 * @param {Object} to 到。
		 * @param {Object} delta 变化。
		 * @return {Object} 结果。
		 */
		c = Fx.compute,
		
		/**
		 * 缓存已解析的属性名。
		 */
		cache = {
			opacity: {
				set: function(target, name, from, to, delta){
					target.setOpacity(c(from, to, delta));
				},
				parse: self,
				get: function(target){
					return target.getOpacity();
				}
			},
			
			scrollTop:{
				set: function (target, name, from, to, delta) {
					target.setScroll(null, c(from, to, delta));
				},
				parse: self,
				get: function(target){
					return target.getScroll().y;
				}
			},
			
			scrollLeft:{
				set: function (target, name, from, to, delta) {
					target.setScroll(c(from, to, delta));
				},
				parse: self,
				get: function(target){
					return target.getScroll().x;
				}
			}
			
		},
	
		/**
		 * @class Animate
		 * @extends Fx.Base
		 */
		Animate = namespace(".Fx.Animate", Fx.Base.extend({
			
			/**
			 * 当前绑定的节点。
			 * @type Element
			 * @protected
			 */
			dom: null,
			
			/**
			 * 当前的状态存储。
			 * @type Object
			 * @protected
			 */
			current: null,
			
			/**
			 * 链接方式。
			 * @type String
			 */
			link: "wait",
			
			/**
			 * 初始化当前特效。
			 * @param {Object} options 选项。
			 * @param {Object} key 键。
			 * @param {Number} duration 变化时间。
			 */
			constructor: function(dom){
				this.dom = dom;
				
				this._competeListeners = [];
			},
			
			/**
			 * 根据指定变化量设置值。
			 * @param {Number} delta 变化量。 0 - 1 。
			 * @override
			 */
			set: function(delta){
				var me = this,
					key,
					target = me.dom,
					value;
				for(key in me.current){
					value = me.current[key];
					value.parser.set(target, key, value.from, value.to, delta);
				}
			},
			
			/**
			 * 生成当前变化所进行的初始状态。
			 * @param {Object} from 开始。
			 * @param {Object} to 结束。
			 */
			compile: function(from, to){
				assert.notNull(from, "Fx.Animate.prototype.start(from, to, duration, callback, link): 参数 {from} ~。");
				assert.notNull(to, "Fx.Animate.prototype.start(from, to, duration, callback, link): 参数 {to} ~。");
					
				// 对每个设置属性
				var me = this,
					key;
				
				// 生成新的 current 对象。
				me.current = {};
				
				for (key in to) {
					
					var parsed = undefined,
						fromValue = from[key],
						toValue = to[key],
						parser = cache[key = key.toCamelCase()];
					
					// 已经编译过，直接使用， 否则找到合适的解析器。
					if (!parser) {
						
						if(key in e.styleNumbers) {
							cache[key] = numberParser;
						} else {
							
							// 尝试使用每个转换器
							for (parser in Animate.parsers) {
								
								// 获取转换器
								parser = Animate.parsers[parser];
								parsed = parser.parse(toValue, key);
								
								// 如果转换后结果合格，证明这个转换器符合此属性。
								if (parsed || parsed === 0) {
									me.dom = me.dom.dom || me.dom;
									// 缓存，下次直接使用。
									cache[key] = parser;
									break;
								}
							}
							
						}
					}
					
					// 找到合适转换器
					if (parser) {
						me.current[key] = {
							from: parser.parse((fromValue ? fromValue === 'auto' : fromValue !== 0) ? parser.get(me.dom, key) : fromValue),
							to: parsed === undefined ? parser.parse(toValue, key) : parsed,
							parser: parser
						};
						
						assert(me.current[key].from !== null && me.current[key].to !== null, "Animate.prototype.complie(from, to): 无法正确获取属性 {key} 的值({from} {to})。", key, me.current[key].from, me.current[key].to);
					}
					
				}
				
				return me;
			}
		
		})),
		
		numberParser = {
			set: function(target, name, from, to, delta){
				target.style[name] = c(from, to, delta);
			},
			parse: function(value){
				return typeof value == "number" ? value : parseFloat(value);
			},
			get: e.styleNumber
		};
	
	Animate.parsers = {
		
		/**
		 * 数字。
		 */
		number: {
			set: navigator.isStandard ? function(target, name, from, to, delta){
				
				target.style[name] = c(from, to, delta) + 'px';
			} : function(target, name, from, to, delta){
				try {
					
					// ie 对某些负属性内容报错
					target.style[name] = c(from, to, delta);
				}catch(e){}
			},
			parse: numberParser.parse,
			get: numberParser.get
			
		},
		
		/**
		 * 颜色。
		 */
		color: {
			set: function set(target, name, from, to, delta){
				target.style[name] = String.arrayToHex([
					Math.round(c(from[0], to[0], delta)),
					Math.round(c(from[1], to[1], delta)),
					Math.round(c(from[2], to[2], delta))
				]);
			},
			parse: function(value){
				return String.hexToArray(value) || String.rgbToArray(value);
			},
			get: e.getStyle
			
		}
		
	};
	
	function self(v){
		return v;
	}
	
	/// #region 元素
	
	var height = 'height marginTop paddingTop marginBottom paddingBottom',
		
		maps = Animate.maps = {
			all: height + ' opacity width',
			opacity: 'opacity',
			height: height,
			width: 'width marginLeft paddingLeft marginRight paddingRight'
		},
	
		ep = e.prototype,
		show = ep.show,
		hide = ep.hide;
	
	Object.update(maps, function(value){
		return String.map(value, Function.from(0), {});
	});
	
	String.map('left right top bottom', Function.from({$slide: true}), maps);
	
	e.implement({
		
		/**
		 * 获取和当前节点有关的 Animate 实例。
		 * @return {Animate} 一个 Animate 的实例。
		 */
		fx: function(){
			return p.getData(this, 'fx') || p.setData(this, 'fx', new p.Fx.Animate(this));
		}
		
	}, 2)	
	
	.implement({
		
		/**
		 * 变化到某值。
		 * @param {String/Object} [name] 变化的名字或变化的末值或变化的初值。
		 * @param {Object} value 变化的值或变化的末值。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onStop] 停止回调。
		 * @param {Function} [onStart] 开始回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
		 * @return this
		 */
		animate: function(){
			var args = arguments, value = args[1];
			if(typeof args[0] === 'string'){
				(args[1] = {})[args[0]] = value;
				args[0] = {};
			} else if(typeof value !== 'object'){
				Array.prototype.unshift.call(args, {});
			}
			
			if (args[2] !== 0) {
				value = this.fx();
				value.start.apply(value, args);
			} else {
				this.set(args[0], args[1]);
				if(args[4]) args[4].call(this);
				if(args[3]) args[3].call(this);
			}
			
			return this;
		},
		
		/**
		 * 显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack, type){
			var me = this;
			if (duration) {
				var elem = me.dom || me, savedStyle = {};
		       
				me.fx().start(getAnimate(type),  {}, duration, function(){
					Element.setStyles(elem, savedStyle);
					
					if(callBack)
						callBack.call(me, true);
				}, function(from, to){
					if(!me.isHidden())
						return false;
					e.show(elem);
					
					if(from.$slide){
						initSlide(from, elem, type, savedStyle);
					} else {
						savedStyle.overflow = elem.style.overflow;
						elem.style.overflow = 'hidden';
					}
					
					for(var style in from){
						savedStyle[style] = elem.style[style];
						to[style] = e.styleNumber(elem, style);
					}
				});
			} else {
				show.apply(me, arguments);
			}
			return me;
		},
		
		/**
		 * 隐藏当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function(duration, callBack, type){
			var me = this;
			if (duration) {
				var  elem = me.dom || me, savedStyle = {};
				me.fx().start({}, getAnimate(type), duration, function(){  
					e.hide(elem);
					e.setStyles(elem, savedStyle);
					if(callBack)
						callBack.call(me, false);
				}, function (from, to) {
					if(me.isHidden())
						return false;
					if(to.$slide) {
						initSlide(to, elem, type, savedStyle);
					} else {
						savedStyle.overflow = elem.style.overflow;
						elem.style.overflow = 'hidden';
					}
					for(var style in to){
						savedStyle[style] = elem.style[style];
					}
				});
			}else{
				hide.apply(me, arguments);
			}
			return this;
		},
	
		/**
		 * 高亮元素。
		 * @param {String} color 颜色。
		 * @param {Function} [callBack] 回调。
		 * @param {Number} duration=500 时间。
		 * @return this
		 */
		highlight: function(color, duration, callBack){
			assert(!color || Array.isArray(color) || rhex.test(color) || rRgb.test(color), "Element.prototype.highlight(color, duration, callBack): 参数 {color} 不是合法的颜色。", color);
			assert(!callBack || Function.isFunction(callBack), "Element.prototype.highlight(color, duration, callBack): 参数 {callBack} 不是可执行的函数。", callBack);
			var from = {},
				to = {
					backgroundColor: color || '#ffff88'
				};
			
			duration /= 2;
			
			this.fx().start(from, to, duration, null, function (from) {
				from.backgroundColor = e.getStyle(this.dom.dom || this.dom, 'backgroundColor');
			}).start(to, from, duration, callBack);
			return this;
		}
	});
	
	/**
	 * 获取变换。
	 */
	function getAnimate(type){
		return Object.extend({}, maps[type || 'all']);
	}
	
	/**
	 * 初始化滑动变换。
	 */
	function initSlide(animate, elem, type, savedStyle){
		delete animate.$slide;
		elem.parentNode.style.overflow = 'hidden';
		var margin = 'margin' + type.charAt(0).toUpperCase() + type.substr(1);
		if(/^(l|r)/.test(type)){
			animate[margin] = -elem.offsetWidth;
			var margin2 = type.length === 4 ? 'marginRight' : 'marginLeft';
			animate[margin2] = elem.offsetWidth;
			savedStyle[margin2] = elem.style[margin2];
		} else {
			animate[margin] = -elem.offsetHeight;
		}
		 savedStyle[margin] = elem.style[margin];
	}
	

	/// #endregion
	
})(JPlus);