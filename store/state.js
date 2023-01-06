// default导出的函数在引用时不需要大括号
import {computed} from "vue";
import {mapState, useStore} from "vuex";
 
//注意这里的mapper是一个数组或对象,因为mapState可以解析数组和对象
export default function useState(mapper) {
    //拿到store独享
    const store = useStore()
    //获取到对应的functions:{name: function() {},counter: function() {}}
    const storeStateFns = mapState(mapper)
 
    //对数据进行转换
    const storeState = {}
    Object.keys(storeStateFns).forEach(fnKey => {
        const fn = storeStateFns[fnKey].bind({$store: store});
        storeState[fnKey] = computed(fn)
    })
    return storeState
}