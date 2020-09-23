# Number

> JavaScript 的 Number 对象是经过封装的能让你处理数字值的对象。Number 对象由 Number() 构造器创建。
>
> JavaScript 的 Number 类型为双精度 IEEE 754 64 位浮点类型。
>
> 最近出了 stage3BigInt 任意精度数字类型，已经进入 stage3 规范

> IEEE: 电气和电子工程师协会（IEEE，全称是 Institute of Electrical and Electronics Engineers）是一个美国的电子技术与信息科学工程师的协会。

> 双精度浮点数：双精度浮点数(double)是计算机使用的一种数据类型，使用 64 位（8 字节） 来存储一个浮点数。 它可以表示十进制的 15 或 16 位有效数字，其可以表示的数字的绝对值范围大约是：-1.79E+308 ~ +1.79E+308。C、C++中使用到的双精度浮点数（double）类型是在 IEEE 二进制浮点数算术标准（ANSI/IEEE Std 754-1985）中定义的。双精度浮点数（Double）用来表示带有小数部分的实数，一般用于计算机变成中定义变量，占用 8 个字节存储空间，其数值范围为-1.7E-308 ～ 1.7E+308，双精度浮点数最多有 15 或 16 位十进制有效数字

> 浮点数：是属于**有理数中某特定子集**的数的数字表示，在计算机中用以近似表示任意某个实数。具体的说，这个实数由**一个整数或定点数（即尾数）乘以某个基数（计算机中通常是 2）的整数次幂**得到，这种表示方法类似于基数为 10 的科学计数法。

> 实数：包括有理数与无理数，即：整数、分数、无限不循环小数。数学上，实数与数轴上的点一一对应。

> 双精度：https://www.zhihu.com/question/26022206。

参考文档：

\[1\]: [在编程中，为什么要把小数叫做浮点数？](https://baijiahao.baidu.com/s?id=1618173300159774003&wfr=spider&for=pc)

\[2\]: [单精度与双精度是什么意思，有什么区别？](https://www.zhihu.com/question/26022206)

\[3\]: [浮点数的原理简析](https://blog.csdn.net/whyel/article/details/81067989)

\[4\]: [ECMAScript 中的 Number Type 与 IEEE 754-2008](https://blog.csdn.net/weixin_34406061/article/details/91368415)

\[5\]: [IEEE 754 浮点数标准中 64 位浮点数为什么指数偏移量是 1023？](https://segmentfault.com/q/1010000016401244)

## 计算机中数的存储与表示

在计算机中，数据以二进制存储，也就是说不存在小数、整数、负数的概念，所以我们在计算机中存储表示数时需要用一种特殊的方式处理，即：浮点数。根据 IEEE754 标准规定，**浮点数由“符号”、“指数”和“尾数”3 部分构成**。

```
// 格式
符号  指数位   尾数
--------------------------------------
| ± |        |                        |
--------------------------------------

// 单精度浮点数表示
sign  8bits            23bits
 |     |                |
|0|0100 0000|010 0000 0000 0000 0000 0000|
 |        |                       |
 31       23                      0 index
 高位                               低位
```

下表列出 C++中不同精度浮点数内存布局：

<html>
<table>
<thead>
<tr>
<th>精度</th>
<th>C++类型</th>
<th>长度</th>
<th>符号位数</th>
<th>指数位数</th>
<th>尾数位数</th>
<th>有效位数</th>
<th>指数偏移</th>
<th>隐含位</th>
</tr>
</thead>
<tbody>
<tr>
<td>单精度浮点数</td>
<td>float</td>
<td>32</td>
<td>1</td>
<td>8</td>
<td>23</td>
<td>24</td>
<td>127</td>
<td>1个隐含位</td>
</tr>
<tr>
<td>双精度浮点数</td>
<td>double</td>
<td>64</td>
<td>1</td>
<td>11</td>
<td>52</td>
<td>53</td>
<td>1023</td>
<td>1个隐含位</td>
</tr>
<tr>
<td>扩展双精度浮点数</td>
<td>long double</td>
<td>80</td>
<td>1</td>
<td>15</td>
<td>64</td>
<td>64</td>
<td>16383</td>
<td>无隐含位</td>
</tr>
</tbody>
</table>
</html>

以 float 为例，float 的规格化表示为：

```math
±1.f \times 2 ^ {E - 127}
```

其中，整数 1 是隐含位，f 是尾数，E 是指数，`127`是指数偏移量。

> 指数偏移量。计算机表示单精度浮点数时，是用 8 位去存储指数部分，表示十进制的 0\~255，但是我们同样需要有负指数，正负指数的位数量为了均等，各自一半，（[1,127],[128,254]），0 与 255 是特殊位。P.S.:还可以通过高位加 0 或 1 来表示数值的正负。

> 隐含位: 规格化表示的浮点数，整数位固定为 1，如果是 0，可以通过修改指数来让整数位为 1。因为固定为 1，所以不用存储，称为隐含位。

> 有效位数：即使尾数位只有 23 位，但是因为有了隐含位，所以实际可以存储 24 位尾数。

对于十进制数`123.125`，其二进制表示为：`1111011.001`，规格化表示（按二进制运算）为：

```math
1.111011001\times2^6
```

=>

```math
1.111011001\times2^{133 - 127}
```

在内存中表示：

```
sign 6 = 133-127(10进制)  向右补0
 |     |                    |
|1|1000 0101|111 0110 0100 0000 0000 0000|
```

**规格化表示的浮点数，整数位固定为 1，可以省略，所以用 23 位可以存储 24 位的尾数**。这里可以得出一个结论：任意一个 int 值（整数，二进制表示），只要存在这样的序列：从最低位开始找到第一个 1，然后从这个 1 向高位数移动 24 位停下，如果更高的位上不再有 1，那么该 int 值即可被 float 精确表示，否则就不行。简单说，就是第一个 1 开始到最后一个 1 为止的总位数超过 24，那么该 int 值就不能被 float 类型精确表示。
很容易得出，从 1 开始的连续整数里面第一个不能被 float 精确表示的整数，其二进制形式为：1000000000000000000000001，即 16777217。

```math
1.0000 0000 0000 0000 0000 0001\times2^{24}
```

f 有 24 位，最后一个 1 只能舍弃，也就成了：

```math
1.000 0000 0000 0000 0000 0000\times2^{24}

```

在内存中表示：

```
24 = 151 - 127(10进制)
      |
|1|0001 1000|000 0000 0000 0000 0000 0000|
```

也就是说**在单精度浮点数中，`2^24-1`为最大安全整数**。

## javascript 中的`0.1+0.2`问题

未完待续。。。