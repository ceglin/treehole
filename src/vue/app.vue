<template>
	<div id="page">
		<mu-appbar title="Title">
		  <mu-icon-button icon="menu" slot="left"/>
		  <mu-flat-button label="expand_more" slot="right"/>
		  <mu-icon-button icon="expand_more" slot="right"/>
		</mu-appbar>
		<router-view></router-view>
		<div class='bottom'>
			<mu-paper>
			  <mu-bottom-nav :value="bottomNav" @change="handleChange">
			    <mu-bottom-nav-item value="recents" title="主页" icon="restore" to="/"/>
			    <mu-bottom-nav-item value="favorites" title="广场" icon="favorite" to="/square"/>
			    <mu-bottom-nav-item value="nearby" title="我" icon="location_on" to="/me"/>
			  </mu-bottom-nav>
			</mu-paper>			
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				bottomNav: 'recents'
			}
		},
		methods: {
			handleChange(val){
				this.bottomNav = val
			}
		}
	}
</script>

<style>
	#page{
		width:100%;
		min-height: 100%;
	}
	.bottom{
		position: fixed;
		bottom:0;
		width:100%;
	}

</style>