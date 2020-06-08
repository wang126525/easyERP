import axios from 'axios'
import vm from '../main'

// 配置默认axios参数
const service = axios.create({
	baseURL: '',
	timeout: 10000
})

// 添加请求拦截器
service.interceptors.request.use(config => {
  config.headers.common['token'] = localStorage.getItem('token');
	
  return config;
})

service.interceptors.response.use(response => {
  console.log('response',response)
		if (response.status === 200||response.status===201) {
      if(response.data.status){
        
      }else{
        if(response.data.msg=='登录超时'||response.data.msg=='Token无效'){
          
          vm.$router.push('/login')
        }
        vm.$message.error(response.data.msg?response.data.msg:'服务器出错')
      }
      return response.data
    }else{
      vm.$message.error('服务器出错')
      return Promise.reject(response.data)
    }
  }
			
	
)




export default service
