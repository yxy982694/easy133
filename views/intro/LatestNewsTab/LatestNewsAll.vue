<template>
    <div class="news-all-container">
      <p>公告查询</p>
      <div class="news-option-item">
      	<label>标题:</label>
      	<el-input type="text" placeholder="请输入标题"></el-input>
      </div>
      <div class="news-option-item">
      	<label>发布部门:</label>
      	<el-select v-model="valueDept" placeholder="请选择部门">
		    <el-option
		      v-for="item in deptOptions"
		      :key="item.id"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		</el-select>
      </div>
      <div class="news-option-item">
      	<label>选择日期:</label>
      	<el-date-picker
	      v-model="valueDate"
	      type="daterange"
	      range-separator="至"
	      start-placeholder="开始日期"
	      end-placeholder="结束日期">
	    </el-date-picker>
      </div>
      <div class="news-option-item">
      	<label>公告类型:</label>
      	<el-select v-model="valueAnnounce" placeholder="请选择公告类型">
		    <el-option
		      v-for="item in announceOptions"
		      :key="item.id"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		</el-select>
      </div>
      <div class="news-option-item">
      	<label>割接类型:</label>
      	<el-select v-model="valueCut" placeholder="请选择割接类型">
		    <el-option
		      v-for="item in cutOptions"
		      :key="item.id"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		</el-select>
      </div>
      <div class="news-option-item">
      	<label>选择割接日期:</label>
      	<el-date-picker
	      v-model="valueCutDate"
	      type="daterange"
	      range-separator="至"
	      start-placeholder="开始日期"
	      end-placeholder="结束日期">
	    </el-date-picker>
      </div>
      <div>
      	<kt-button icon="fa fa-search" type="primary" class="user-search-btn" :label="$t('action.search')" @click="searchAll"></kt-button>
      	<kt-button icon="fa fa-search" type="primary" class="user-search-btn" :label="$t('action.reset')" @click="resetAll"></kt-button>
      	<kt-button icon="fa fa-search" type="primary" class="user-search-btn" :label="$t('action.leadout')" @click="resetAll"></kt-button>
      </div>
      <div>
      	<el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          >
        </el-pagination>
      </div>
      <div>
      	<el-table :data="newsData">
      		<el-table-column 
	      		v-for="column in newColumns"
	      		:prop="column.prop" 
	      		:label="column.label" 
	      		:key="column.prop">
      		</el-table-column>
      	</el-table>
      </div>
    </div>
</template>

<script>
  import KtButton from "@/components/KtButton/KtButton"
  export default {
    data () {
    	return {
    		valueDate: null,
    		valueCutDate: null,
    		valueDept: null,
			valueAnnounce: null,
			valueCut: null,
			currentPage: 1,
			pageSizes: [15,50,100,200],
			pageSize: 15,
			total: 200,
			newsData: [{
				title: '标题',
				publisher: '赵丹萍',
				publishDept: 'emos',
				publishTime: '2020-2-13',
				announceType: '日常事务',
				queries: '5',
			},{
				title: '标题',
				publisher: '赵丹萍',
				publishDept: 'emos',
				publishTime: '2020-2-13',
				announceType: '日常事务',
				queries: '5',
			}],
			newColumns: [
				{prop:"title", label:"标题"},
	            {prop:"publisher", label:"发布人"},
	            {prop:"publishDept", label:"发布机构"},
	            {prop:"publishTime", label:"发布时间"},
	            {prop:"announceType", label:"公告类型"},
	            {prop:"queries", label:"查阅次数"},
            ],
    		cutOptions: [{
    			id: 0,
    			value:'所有',
    			label:'所有'
    		},{
    			id: 1,
    			value:'已退网网元',
    			label:'已退网网元'
    		},{
    			id: 2,
    			value:'新入网网元',
    			label:'新入网网元'
    		},{
    			id: 3,
    			value:'割接调整网元',
    			label:'割接调整网元'
    		}],
    		announceOptions: [{
    			id: 0,
    			value:'所有',
    			label:'所有'
    		},{
    			id: 1,
    			value:'日常事务',
    			label:'日常事务'
    		},{
    			id: 2,
    			value:'网络变动',
    			label:'网络变动'
    		},{
    			id: 3,
    			value:'应急',
    			label:'应急'
    		}],
    		deptOptions: [{
    			id: 0,
    			value:'emos',
    			label:'emos'
    		},{
    			id: 1,
    			value:'信息管理',
    			label:'信息管理'
    		},{
    			id: 2,
    			value:'移动',
    			label:'移动'
    		}]
    	}
    },
    components: {
    	KtButton
    },
    methods: {
    	searchAll: function () {

    	},
    	resetAll: function () {

    	},
    	handleSizeChange: function () {

    	},
		handleCurrentChange: function () {

		},
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"
  .news-all-container
    height: 100%
    overflow: auto
  .news-option-item
    margin-top: 10px
</style>