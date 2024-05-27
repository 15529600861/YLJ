import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
// 引入socket模块
import io from "./components/socket/weapp.socket.io.js"
Vue.config.productionTip = false
// 服务器地址
// 获取当前网址路径
// function getCurrentURL() {
// 	if (typeof window !== 'undefined' && window.location) {
// 		console.log(window.location);
// 		return window.location.hostname;
// 	} else if (typeof document !== 'undefined' && document.URL) {
// 		console.log(document.URL);
// 		console.log(document.URL.split(':'));
// 		var url = document.URL.split('//')[1]
// 		var urls = url.split(':')[0]
// 		return urls;
// 	} else {
// 		return null; // 如果无法获取到当前网址路径，返回 null 或者其他适当的值
// 	}
// }
// Vue.prototype.serverUrl = 'http://' + getCurrentURL() + ':3000'
// Vue.prototype.socket = io('http://' + getCurrentURL() + ':8082')
// 在需要获取URL的页面中
// function cur() {
// 	let pages = getCurrentPages(); // 获取当前页面栈
// 	let currentPage = pages[pages.length - 1]; // 获取当前页面
// 	let currentUrl = '/' + currentPage.route; // 获取当前页面的URL

// 	console.log("当前页面URL为：" + currentUrl);
// }

// Vue.prototype.cur = cur;

const serverUrl = 'http://192.168.1.202:3000';
const socketUrl = 'http://192.168.1.202:8082';

Vue.prototype.serverUrl = serverUrl;
Vue.prototype.socket = io(socketUrl);

// console.log(serverUrl, Vue.prototype.socket);

// Vue.prototype.serverUrl = 'http://192.168.1.202:3000'
// Vue.prototype.socket = io('http://192.168.1.202:8082')

App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif