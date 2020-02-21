/*
* @Author: H-f-society
* @Date:   2020-02-20 22:48:46
* @Last Modified by:   H-f-society
* @Last Modified time: 2020-02-22 00:22:47
*/
var NUMBER = [1, 2, 3, 4, 5, 6, 7, 8, 9];
Array.prototype.shuffle = function() { //洗牌算法
	var input = this;
	for(let i=input.length-1; i>=0; i--) {
		var index    = Math.floor(Math.random() * (i + 1));
		var temp     = input[index];
		input[index] = input[i];
		input[i]     = temp;
	}
	return input;
}
Array.prototype.CrackSudoku = function() {
	var grid = this;
	return dfs(grid, 0, 0);
	function dfs(grid, x, y) {
		if(y >= 9) {
			x++;
			y = 0;
			if(x >= 9) return true;
		}
		if(grid[x][y] == 0) {
			//新增洗牌算法对1-9打乱再填入，确保每次答案都不一样
			NUMBER.shuffle();
			for(let num of NUMBER) {
			//for(let num=1; num<=9; num++) {
				if(isTrue(grid, new Array(x, y), num)) {
					grid[x][y] = num;
					//draw.drawRole(y, x, num);
					if(dfs(grid, x, y + 1)) return true;
					grid[x][y] = 0;
					//draw.drawRole(y, x, 0);
				}
			}
		}else {
			return dfs(grid, x, y+1);
		}
		return false;
	}
	function isTrue(grid, point, num) {
		for(let i=0; i<9; i++) {
			if(i!=point[0] && grid[i][point[1]] == num) return false;
			if(i!=point[1] && grid[point[0]][i] == num) return false;
		}
		let x = Math.floor(point[0]/3)*3;
		let y = Math.floor(point[1]/3)*3;
		for(let i=x; i<x+3; i++) {
			for(let j=y; j<y+3; j++) {
				if((i!=point[0] && j!=point[1]) && grid[i][j] == num) return false;
			}
		}
		return true;
	}
}
var GameConfig = function() {
	this.ImagePath = "image/style0/";
	this.ImageType = ".png";
	this.colorOne  = "#E5C499";
	this.colorTwo  = "#7F4A38";
	this.MapSize   = 500;
	this.NowNum = 0;
	this.GameMap;
}
GameConfig.prototype.setNowNum = function(num) { this.NowNum = num; }
GameConfig.prototype.setNumber = function(x, y) {
	this.GameMap[x][y] = this.NowNum;
	draw.drawRole(y, x, this.NowNum);
}
GameConfig.prototype.crackSudoku = function() {
	if(this.GameMap.CrackSudoku()) {
		//此段绘图放在回溯算法里速度太快
		//有时绘制与擦除时间上的错乱导致部分内容可能会空白没绘制上
		for(let i=0; i<9; i++) {
			for(let j=0; j<9; j++) {
				draw.drawRole(j, i, this.GameMap[i][j]);
			}
		}
	}
	console.clear();
	console.log(this.GameMap);
}
GameConfig.prototype.InitGameMap = function() {
	this.GameMap = new Array(9);
	for(let i=0; i<9; i++) {
		this.GameMap[i] = new Array(9);
		this.GameMap[i].fill(0);
		for(let j=0; j<9; j++) draw.drawRole(i, j, 0);
	}
}
var Draw = function() {
	this.drawMap = function(MapSize) {
		let size = MapSize / 9;
		for(let i=0; i<=size; i++) {
			ctx.moveTo(i*size, 0);
			ctx.lineTo(i*size, MapSize*size);
			ctx.moveTo(0, i*size);
			ctx.lineTo(MapSize*size, i*size);
			ctx.stroke();
		}
		for(let i=0; i<3; i++) {
			for(let j=0; j<3; j++) {
				if((i%2==0 && j%2==0) || (i%2!=0 && j%2!=0))
					ctx.fillStyle = config.colorOne;
				else
					ctx.fillStyle = config.colorTwo;
				size = MapSize / 3;
				ctx.fillRect(i*size, j*size, size, size);
			}
		}
	}
	this.drawRole = function(x, y, role) {	// 绘制角色
		let size = config.MapSize / 9;
		let img  = new Image();
		img.src  = config.ImagePath + role + config.ImageType;
		img.onload = function() {
			ctx.drawImage(img, x*size+10, y*size+10, size-20, size-20);
		}
	}
}

var canvas = document.getElementById("box");
var ctx    = canvas.getContext("2d");

var config = new GameConfig();
var draw   = new Draw();

canvas.width  = config.MapSize;
canvas.height = config.MapSize;

draw.drawMap(config.MapSize);
config.InitGameMap();

$(document).ready(function() {
	$("#Btn span").bind("click", function() {
		$("#Btn span").attr("class", "btnNum");
		$("#"+this.id).attr("class", "clickNum");
		$(".btnNum").css("background-color", "#656464");
		$(".clickNum").css("background-color", "#3F3E3E");
		config.setNowNum(parseInt(this.id[1]));
	});
	$("#sub").click(function() {
		config.crackSudoku();
	});
	$("#clear").click(function() {
		config.InitGameMap();
	});
	canvas.onmouseup = function(e) {
		let x = Math.floor(e.offsetY / (config.MapSize / 9));
		let y = Math.floor(e.offsetX / (config.MapSize / 9));
		if(config.NowNum == 0) config.setNumber(x, y);
		else {
			if(isTrue(config.GameMap, new Array(x, y), config.NowNum)) 
				config.setNumber(x, y);
			else alert(config.NowNum+" 在该位置上无效");
		}
	}
	function isTrue(grid, point, num) {
		for(let i=0; i<9; i++) {
			if(i!=point[0] && grid[i][point[1]] == num) return false;
			if(i!=point[1] && grid[point[0]][i] == num) return false;
		}
		let x = Math.floor(point[0]/3)*3;
		let y = Math.floor(point[1]/3)*3;
		for(let i=x; i<x+3; i++) {
			for(let j=y; j<y+3; j++) {
				if((i!=point[0] && j!=point[1]) && grid[i][j] == num) return false;
			}
		}
		return true;
	}
});