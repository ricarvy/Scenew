export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown string
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "your-image-deserves-to-be-seen",
    title: "你心里的那张图，值得被世界看见",
    excerpt: "有些话，在心里转了很多圈，最后还是咽了回去。有些图，在脑海里已经完整得像一幅画，却始终没能变成手机相册里的任何一张。这篇文章，是写给你的。",
    content: `
      <p><em>——写给每一个「差一点就放弃表达」的人</em></p>
      
      <hr />
      
      <p>有些话，在心里转了很多圈，最后还是咽了回去。</p>
      
      <p>有些图，在脑海里已经完整得像一幅画，却始终没能变成手机相册里的任何一张。</p>
      
      <p>有些人，曾经是那个会为一朵云停下脚步的人，后来慢慢变成了匆匆路过的人。</p>
      
      <p>如果你也有过类似的感觉——</p>
      
      <p>这篇文章，是写给你的。</p>
      
      <hr />
      
      <h2>一、那些在深夜被删掉的草稿</h2>
      
      <img src="https://images.unsplash.com/photo-1635764131814-b980e291754a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwY29mZmVlJTIwbGFwdG9wJTIwZGVzayUyMGFiYW5kb25lZCUyMHdvcmslMjBsYXRlJTIwbmlnaHR8ZW58MXx8fHwxNzczMDQzMzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="凉掉的咖啡和暗下去的屏幕" />
      
      <p>我曾经也是一个认真做内容的人。</p>
      
      <p>不是那种有几十万粉丝的大博主，只是一个喜欢分享、愿意花时间把事情做好看的普通创作者。我会为了一篇穿搭笔记，提前三天下单衣服，等快递的时候反复修改文案，收到以后换上衣服满屋子找角度，拍了五十张选出三张，修完图已经是深夜。</p>
      
      <p>然后发出去。</p>
      
      <p>然后——几乎没有人看到。</p>
      
      <p>我不怨算法，我知道这个世界内容太多了。可我就是忍不住想：我花了一周做出来的东西，它存在过的证据，只是后台那个冷冰冰的个位数。</p>
      
      <p>有人说这叫优胜劣汰，是市场的正常法则。</p>
      
      <p>可坐在屏幕前的那个人不是「市场」。她是一个活生生的、刚刚熬了三个小时的、现在有点想哭的人。</p>
      
      <p><strong>这不是淘汰，是消磨。</strong></p>
      
      <p>是每一次用心但落空之后，身体里那个叫作「想表达」的声音，变得越来越轻，越来越远。</p>
      
      <p>直到有一天你打开编辑器，盯着空白的页面，发现自己什么都不想写了。</p>
      
      <hr />
      
      <h2>二、灵感像一场短暂的雨</h2>
      
      <img src="https://images.unsplash.com/photo-1527377761-f99968ed8a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnRlcm5vb24lMjBzdW5saWdodCUyMHdpbmRvdyUyMGZsb29yJTIwc2hhZG93JTIwbW92aW5nJTIwcG9ldGljfGVufDF8fHx8MTc3MzA0MzM2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="午后的光影在安静地流走" />
      
      <p>你有没有过这样的瞬间——</p>
      
      <p>刷到一件外套，脑海里突然出现了一个画面：穿着它走在深秋的梧桐树下，叶子刚好落在肩膀上，光影斑驳，你回头微笑。连配什么文字都想好了，是那首你很喜欢的诗里的一句。</p>
      
      <p>那个画面清晰得像电影镜头。那一刻你心跳加速，觉得「对，就是这个感觉」。</p>
      
      <p>然后你开始下单。等了四天快递。拆开发现颜色和图片有色差。勉强穿上，站在卧室的白墙前面举起手机，试了七八个角度。拍完翻看，没有一张是你心里的那个画面。</p>
      
      <p>那条梧桐树下的路在哪里呢？那片恰到好处的光影呢？那个回头微笑的自己呢？</p>
      
      <p><strong>灵感是一场短暂的雨。它落下的时候，你如果没有接住它的容器，它就消失了。</strong></p>
      
      <p>不是消失在空气里，是消失在快递的等待里，消失在退货的流程里，消失在「算了，条件不允许」的叹息里。</p>
      
      <p>我们总以为灵感会再来。但很多灵感，一生只造访一次。</p>
      
      <p>那些因为条件不够而没有被创造出来的内容，那些在脑海里绚烂但在现实中夭折的画面——它们去了哪里？</p>
      
      <p>没有人知道。</p>
      
      <p>因为从来没有人见过它们。</p>
      
      <hr />
      
      <h2>三、我们是从什么时候开始不爱拍照了？</h2>
      
      <img src="https://images.unsplash.com/photo-1599134865137-16c4b11ffd85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbWlycm9yJTIwYmx1cnJ5JTIwcmVmbGVjdGlvbiUyMHdvbWFuJTIwc2lsaG91ZXR0ZXxlbnwxfHx8fDE3NzMwNDMzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="镜子里模糊的自己" />
      
      <p>我的一个朋友，以前是个很爱拍照的人。旅行的时候要拍，吃饭的时候要拍，甚至路边看到一只猫也要蹲下来拍三分钟。</p>
      
      <p>不知道从什么时候起，她不拍了。</p>
      
      <p>我问过她为什么。她说：「没什么好拍的。」</p>
      
      <p>后来有一次我们一起出去，经过一片开得很盛的花墙。我看到她眼睛亮了一下，手伸向了口袋——然后又缩了回来。</p>
      
      <p>她不是「没什么好拍的」。她是觉得自己拍不出那个花墙最好看的样子。举起手机的那一秒，有一个声音在说：拍了也不好看，发了也没人点赞，算了吧。</p>
      
      <p><strong>人天生是需要表达的。</strong></p>
      
      <p>小时候我们拿起蜡笔就画，张开嘴就唱，从来不会担心画得好不好、唱得准不准。可长大以后，我们学会了评判，学会了比较，学会了在按下快门之前先在心里预演一遍「别人会怎么看」。</p>
      
      <p>然后我们一个一个，放下了手里的相机。</p>
      
      <p>生活本来有很多值得记录的瞬间：早晨六点厨房里的第一缕光，孩子笑着跑过来扑进你怀里的那一刻，你穿上新买的裙子在镜子前悄悄转了个圈——这些都是你和世界之间柔软的连接。</p>
      
      <p>但因为「拍不好」「写不出」「表达不了」，这些瞬间就这样安静地流过去了。</p>
      
      <p>没有被记住，也没有被分享。</p>
      
      <p><strong>我们不是失去了发现美的能力，是被生活压得太紧，连表达美的力气都没有了。</strong></p>
      
      <hr />
      
      <h2>四、深夜修完第 47 张图之后</h2>
      
      <img src="https://images.unsplash.com/photo-1699430245381-ad5be3690d26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBoZWFkJTIwZG93biUyMHRpcmVkJTIwZGVzayUyMGRhd24lMjBleGhhdXN0ZWQlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NzMwNDMzNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="触底反弹之前的那个夜晚" />
      
      <p>那天凌晨两点半，我修完了第 47 张图。</p>
      
      <p>为了一组和秋天有关的穿搭图，我等了五天快递、跑了两个公园取景、在寒风里站了三个小时、回来修了一整个晚上。最后选出 9 张，配了将近一千字的文案。</p>
      
      <p>发出去之后，我洗了个澡，看着镜子里疲惫的自己，突然有一种很荒谬的感觉：</p>
      
      <p><strong>我明明是因为喜欢美、想要分享美，才开始做内容的。为什么到最后，创作本身变成了一件让我痛苦的事？</strong></p>
      
      <p>从灵感到成品，中间隔着的不是创造力的匮乏，而是物流、天气、场地、设备、修图、文案……无穷无尽的执行成本。这些东西一点一点地蚕食着热情，直到你忘了自己最初为什么出发。</p>
      
      <p>那天晚上我在笔记本上写了一行字：</p>
      
      <p><em>「一定有更好的方式。」</em></p>
      
      <p>后来这行字变成了一个产品。我给它取名叫 <strong>Scenew</strong>。</p>
      
      <hr />
      
      <h2>五、如果脑海中的画面可以直接变成现实</h2>
      
      <img src="https://images.unsplash.com/photo-1672661500480-33b9eac963d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwbGlnaHQlMjB0aHJvdWdoJTIwY2xvdWRzJTIwY2l0eSUyMGhvcGUlMjBuZXclMjBiZWdpbm5pbmd8ZW58MXx8fHwxNzczMDQzMzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="晨光从云层缝隙里涌进来" />
      
      <p>Scenew 做的事情，说起来很简单——</p>
      
      <p><strong>它让「你想象中的画面」，不用经历那些漫长的消耗，直接变成「你眼前的图片」。</strong></p>
      
      <p>上传一张你的照片，再上传一件你心动的商品，告诉它你想要的场景。几秒钟之后，你就能看到那个穿着新衣服走在梧桐树下的自己。</p>
      
      <p>不用等快递。不用约摄影师。不用看天气。不用因为「条件不够」而放弃。</p>
      
      <p>而那些你曾经想说却不知道怎么组织的话，AI 也会帮你轻轻写好——一段和画面情绪相称的文案，像是替你说出了心里那句「就是这个感觉」。</p>
      
      <p><strong>灵感来的那一刻，你就可以接住它。</strong></p>
      
      <p>不必等它冷却，不必让它在琐碎中消散。从心动到呈现，中间只隔着几次点击。</p>
      
      <hr />
      
      <h2>六、写给那些还在认真做内容的人</h2>
      
      <img src="https://images.unsplash.com/photo-1650686947677-b62e1acf99ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcmVsYXhlZCUyMHBob25lJTIwYnJpZ2h0JTIwd29ya3NwYWNlJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzczMDQzMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="创作本该有的样子" />
      
      <p><strong>小鱼</strong>是一个小红书穿搭博主。不是大 V，只是一个喜欢衣服、喜欢分享的女生。</p>
      
      <p>她以前做一篇穿搭笔记的流程是：逛电商平台种草 → 下单 → 等快递三五天 → 试穿发现有的不合适 → 勉强拍照 → 修图 → 绞尽脑汁写文案 → 不满意的退货 → 重新来过。</p>
      
      <p>一周的时间，换来两篇笔记和一地快递箱。</p>
      
      <p>用了 Scenew 之后，她跟我说了一句话：</p>
      
      <blockquote>
        <p><em>「我终于可以只做我最喜欢的那件事了——发现好看的东西，然后把它分享出去。中间那些烦人的过程，不见了。」</em></p>
      </blockquote>
      
      <p><strong>做同款模式</strong>让她看到心动的单品就能立刻生成上身效果，脸型、发型、体态都是自己的样子。<strong>AI 同步生成的配套文案</strong>，省去了她对着图片冥思苦想的半小时。不用下单，不用退货，不用跟快递赛跑。</p>
      
      <p>从种草到发布，十分钟。省下来的时间，她用来逛街、看展、发呆——这些才是灵感真正的来处。</p>
      
      <hr />
      
      <h2>七、写给那些为好产品焦虑的人</h2>
      
      <img src="https://images.unsplash.com/photo-1704729105381-f579cfcefd63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGF0ZWxpZXIlMjB3YXJtJTIwbGlnaHQlMjBoYW5kbWFkZSUyMGZhc2hpb24lMjBkZXNpZ24lMjBzdHVkaW98ZW58MXx8fHwxNzczMDQzMzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="好东西值得被好好呈现" />
      
      <p><strong>阿梅</strong>开了一家原创设计师服装小店。每一件衣服都是她亲自挑选面料、反复打版做出来的。</p>
      
      <p>但在电商的世界里，酒香也怕巷子深。一组好的商品图，要模特、摄影师、化妆师、场地——这些成本，对一家刚起步的小店来说，是真正的奢侈。</p>
      
      <p>她拍不起巴黎的街头、马尔代夫的海滩，也请不起超模。但她的衣服，值得那些场景。</p>
      
      <p>Scenew 给了她一个「可能性」：</p>
      
      <p>上传服装图 → 选择模特形象和场景 → AI 生成专业级场景图。</p>
      
      <p>开启<strong>种草模式</strong>之后，每张图自动嵌入商品卡片和购买链接，AI 还会写好一段走心的种草文案——从图到文到购买入口，一气呵成。一张图就是一个完整的带货单元。</p>
      
      <p>她不用再为「呈现」发愁了。她只需要做好她最擅长的事情——用心做衣服。</p>
      
      <blockquote>
        <p>阿梅说：<em>「我做的每一件衣服都有故事，以前讲不出来。现在 Scenew 帮我把故事变成了看得见的画面，还替我写好了旁白。」</em></p>
      </blockquote>
      
      <hr />
      
      <h2>八、写给那个很久没发朋友圈的你</h2>
      
      <img src="https://images.unsplash.com/photo-1715938080547-9bae2cdd20bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdpbmRvdyUyMHRlYSUyMHN1bmxpZ2h0JTIwcGVhY2VmdWwlMjBvcmRpbmFyeSUyMGxpZmUlMjBtb21lbnR8ZW58MXx8fHwxNzczMDQzMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="美不在远方，就在你转身的那一刻" />
      
      <p><strong>晓晓</strong>不做内容，也不开店。她只是一个每天挤地铁、加班、回家刷手机的普通人。</p>
      
      <p>她上一条朋友圈是三个月前。</p>
      
      <p>不是生活没有值得分享的瞬间——上周末她去了一家很好看的咖啡店，春天路边的樱花开了，同事送了她一束小雏菊。这些她都想拍，也都想发。</p>
      
      <p>但每次举起手机，心里总有个声音说：「拍出来也不好看。」</p>
      
      <p>她用 Scenew，纯粹是因为好奇。看到一条很美的碎花裙，随手上传试了试。几秒钟后，她看到了自己穿着那条裙子站在薰衣草花田里的样子。</p>
      
      <p>屏幕下方，AI 写了一句文案：<em>「风吹过花田的时候，我在想，美好的事情不一定要等准备好了才开始。」</em></p>
      
      <p>她把那张图和那句话一起发了朋友圈。</p>
      
      <p>那天晚上收到了十几条评论。有人说好好看，有人问裙子在哪买的，还有一个很久没联系的老同学留言说：「好久不见你发动态了，看到你在好好生活，真好。」</p>
      
      <p>她跟我说：</p>
      
      <blockquote>
        <p><em>「我以前总觉得，发朋友圈是那些很会拍照、很会生活的人的事情。原来我也可以。」</em></p>
      </blockquote>
      
      <p><strong>原来她也可以。</strong></p>
      
      <p>原来每个人心里都有一张想要呈现的图。只是在此之前，没有人帮她把那张图从脑海里拿出来。</p>
      
      <hr />
      
      <h2>九、不是在偷懒，是在把时间还给真正重要的事</h2>
      
      <img src="https://images.unsplash.com/photo-1636207188968-42e64c2b1578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwbGluZWQlMjBwYXRoJTIwc3VubGlnaHQlMjBkYXBwbGVkJTIwYXV0dW1uJTIwcG9ldGljJTIwcm9hZHxlbnwxfHx8fDE3NzMwNDMzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="路、光、远方" />
      
      <p>也许你会想：用 AI 生成图片和文案，是不是太「偷懒」了？</p>
      
      <p>我曾经也这样质疑过自己。</p>
      
      <p>后来我想明白了一件事：</p>
      
      <p><strong>创作最珍贵的部分，从来不是修图、写文案、等快递、处理退货。</strong></p>
      
      <p>创作最珍贵的部分是——<strong>你看到一样东西时心里涌起的那股冲动。</strong> 是你在某个瞬间被美击中的那种感觉。是你想要和世界分享某种心情的那个念头。</p>
      
      <p>这些是人的部分，是 AI 替代不了的部分。</p>
      
      <p>而 Scenew 想做的，只是帮你省去中间那些消耗热情的环节。<strong>让你把精力花在「发现美」上，而不是「实现美」的苦力活上。</strong></p>
      
      <p>当你不用再为快递烦恼，不用再为拍照焦虑，不用再为文案发愁——</p>
      
      <p>你会发现，原来你有那么多想说的话，原来你眼里的世界那么好看。</p>
      
      <hr />
      
      <h2>十、Scenew 是什么？</h2>
      
      <img src="https://images.unsplash.com/photo-1729083070618-504f892b0f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxtJTIwbGFrZSUyMHJlZmxlY3Rpb24lMjBza3klMjBtb3VudGFpbiUyMHN0aWxsJTIwd2F0ZXIlMjBtaXJyb3J8ZW58MXx8fHwxNzczMDQzMzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="水面既是镜子也是窗口" />
      
      <p><strong>Scene + New</strong> —— 探索未经之境。</p>
      
      <p>每一个你未曾踏足的地方，每一种你未曾尝试的风格，在这里都可以先「看见」。不是替代真实的体验，而是在体验发生之前，先给自己一个确认的机会：嗯，这就是我想要的样子。</p>
      
      <p><strong>See + New</strong> —— 遇见全新的自己。</p>
      
      <p>你以为自己只适合黑白灰，但也许你穿上那件薄荷绿的时候，连自己都会惊讶。你以为自己只属于格子间，但也许你站在冰岛的黑沙滩上的样子，比你想象的更自在。</p>
      
      <p>在 Scenew 里，没有「拍不好」，没有「我不行」。</p>
      
      <p><strong>只有「原来我也可以这样」。</strong></p>
      
      <hr />
      
      <h2>写在最后</h2>
      
      <img src="https://images.unsplash.com/photo-1638811100297-64f4f2a2bcd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxob3VldHRlJTIwcGVyc29uJTIwaGlsbHRvcCUyMGdvbGRlbiUyMGhvdXIlMjB3aWRlJTIwbGFuZHNjYXBlJTIwdmlzdGF8ZW58MXx8fHwxNzczMDQzMzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="不是结束，是一个新的眺望" />
      
      <p>我做 Scenew 的初心，不是做一个多么了不起的 AI 工具。</p>
      
      <p>我只是不想让那些深夜被删掉的草稿白白消失。</p>
      
      <p>不想让那些灵光一闪的瞬间，因为快递迟到了、天气不好、文案写不出来，就永远沉没在手机备忘录里。</p>
      
      <p>不想让那些明明很美的人，因为觉得自己「不够好」，就放弃了和世界分享自己的机会。</p>
      
      <p>Scenew 还很年轻，有很多需要完善的地方。但它的每一个像素里，都写着同一句话：</p>
      
      <p><strong>你心里的那张图，值得被世界看见。</strong></p>
      
      <p>而你要做的，只是把它从心里拿出来。</p>
      
      <p>剩下的，交给我们。</p>
      
      <hr />
      
      <p><em>把创造交给 AI，把时间留给生活。</em></p>
      
      <p><em>—— Scenew AI Team</em></p>
      
      <hr />
      
      <p style="text-align: center; margin-top: 40px; font-size: 0.9em; color: #A0714A;">
        <a href="https://scenew.mentobe.co/blog" target="_blank" rel="noopener noreferrer" style="text-decoration: none; border-bottom: 1px solid #A0714A;">
          访问 Scenew 博客主页
        </a>
      </p>
    `,
    coverImage: "https://images.unsplash.com/photo-1590501949668-2442efd4d3d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBoZXNpdGF0aW5nJTIwcGhvbmUlMjBzY3JlZW4lMjBkYXJrJTIwcm9vbSUyMHdhcm0lMjBsaWdodHxlbnwxfHx8fDE3NzMwNDMzNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    author: {
      name: "Scenew AI Team",
      avatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&auto=format&fit=crop"
    },
    date: "2026-03-09",
    tags: ["品牌故事", "创作心路", "AI赋能"]
  }
];
