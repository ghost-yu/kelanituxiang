// 全局变量，对应 Python 脚本中的参数
const A = 10;
const L = 300;
let nxSlider, nySlider, atolSlider;
let nxLabel, nyLabel, atolLabel;

// p5.js 的 setup 函数，在程序开始时仅运行一次
function setup() {
  // 创建一个 600x600 像素的画布
  let canvas = createCanvas(600, 600);
  // 将画布放在 body 元素的第一个子元素位置
  canvas.parent(document.body);
  
  // 关联 HTML 中的滑块
  nxSlider = select('#nx');
  nySlider = select('#ny');
  atolSlider = select('#atol');
  
  // 关联用于显示滑块值的 <span> 元素
  nxLabel = select('#nx-val');
  nyLabel = select('#ny-val');
  atolLabel = select('#atol-val');

  // 为每个滑块添加 input 事件监听器
  // 当滑块被拖动时，调用 redrawPattern 函数
  nxSlider.input(redrawPattern);
  nySlider.input(redrawPattern);
  atolSlider.input(redrawPattern);
  
  // 初始绘制一次图形
  redrawPattern();
}

// 核心的绘图函数
function redrawPattern() {
  // 获取当前滑块的值
  let n_x = nxSlider.value();
  let n_y = nySlider.value();
  let atol = atolSlider.value();
  
  // 更新滑块旁边的数值显示
  nxLabel.html(n_x);
  nyLabel.html(n_y);
  atolLabel.html(atol);

  // 告诉 p5.js 我们要开始操作像素了
  loadPixels();

  // 嵌套循环遍历画布上的每一个像素 (x, y)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      
      // 将画布像素坐标 (0 to 600) 映射到数学坐标 (-L to L)
      let mathX = map(x, 0, width, -L, L);
      let mathY = map(y, 0, height, -L, L);
      
      // --- 这是从 Python 翻译过来的核心数学公式 ---
      let g = (Math.cos(n_x * Math.PI * mathX / L) * Math.cos(n_y * Math.PI * mathY / L)) +
              (Math.cos(n_y * Math.PI * mathX / L) * Math.cos(n_x * Math.PI * mathY / L));
      // 为了简化，我们只关心 g 的值，因为 psi = A*g*cos(...) 只要 g 接近 0，psi 也接近 0
      
      // 检查 g 的值是否接近于 0 (等同于 np.isclose)
      if (Math.abs(g) < atol / A) { // 注意这里 atol 需要除以 A
        // 如果接近 0 (节线)，像素设为白色
        set(x, y, color(255));
      } else {
        // 否则，像素设为黑色
        set(x, y, color(34));
      }
    }
  }
  
  // 告诉 p5.js 我们已经完成了像素操作，可以更新到屏幕上
  updatePixels();
}
