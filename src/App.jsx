import React, { useState, useEffect } from 'react';

// Kho dữ liệu 15 câu hỏi
const QUESTION_POOL = [
  {
    id: 'q1_nandoi',
    title: 'Mẫu số chung lợi ích (Năm 1945)',
    context: 'Đất nước vừa giành độc lập, nạn đói đe dọa hàng triệu sinh mạng. Chính quyền mới chưa vững. Đồng chí tham mưu chính sách nào để quy tụ toàn dân?',
    options: [
      { text: 'Phá kho thóc Nhật, phát động phong trào nhường cơm sẻ áo', trust: 15, tension: -15, res: -10, feedback: 'Đúng đắn! Cứu đói tốn nguồn lực nhưng quy tụ được lòng dân lập tức.' },
      { text: 'Dùng quân đội cưỡng chế thu thóc từ các hộ giàu', trust: -15, tension: 20, res: 10, feedback: 'Sai lầm! Dùng bạo lực giai cấp lúc này sẽ phá vỡ khối đoàn kết.' },
      { text: 'Tập trung toàn lực đánh Pháp, tạm gác chuyện cứu đói', trust: -20, tension: 15, res: 5, feedback: 'Nguy hiểm! "Dân chỉ biết giá trị của tự do khi dân được ăn no".' }
    ]
  },
  {
    id: 'q2_khoandung',
    title: 'Lòng khoan dung (Nhân sự Chính phủ)',
    context: 'Nhiều người đề xuất gạt bỏ hoàn toàn quan lại chế độ cũ (như Cựu hoàng Bảo Đại) khỏi Chính phủ để giữ "độ thuần khiết" của cách mạng.',
    options: [
      { text: 'Mời họ làm Cố vấn tối cao, tham gia Chính phủ liên hiệp', trust: 15, tension: -10, res: -5, feedback: 'Chính xác! Trân trọng phần thiện của họ giúp mở rộng Mặt trận.' },
      { text: 'Giam lỏng họ để phòng ngừa phản trắc', trust: -15, tension: 15, res: -5, feedback: 'Quá hẹp hòi! Điều này đẩy họ về phía thế lực thù địch.' },
      { text: 'Tước hết tài sản nhưng cho phép làm thường dân', trust: -5, tension: 10, res: 10, feedback: 'Bạn đang lãng phí nguồn chất xám của giới trí thức cũ.' },
      { text: 'Đưa đi cải tạo tư tưởng ngay lập tức', trust: -20, tension: 20, res: -10, feedback: 'Cách làm tả khuynh cứng nhắc phá hỏng khối đoàn kết trí thức.' }
    ]
  },
  {
    id: 'q3_hiepthuong',
    title: 'Nguyên tắc Hiệp thương (Xung đột)',
    context: 'Giới chủ tư sản và công nhân mâu thuẫn gay gắt về giờ làm việc và tiền lương. Không khí tại xưởng máy đang đình trệ.',
    options: [
      { text: 'Ban bố sắc lệnh ép tư sản nhượng bộ toàn bộ yêu sách', trust: -10, tension: 15, res: -10, feedback: 'Sai nguyên tắc! Áp đặt sẽ khiến giới công thương ngừng sản xuất.' },
      { text: 'Đứng về phía tư sản, đàn áp công nhân đình công', trust: -20, tension: 20, res: 5, feedback: 'Đi ngược lại nền tảng liên minh Công - Nông của Mặt trận.' },
      { text: 'Tổ chức bàn bạc hiệp thương, tìm điểm nhượng bộ chung', trust: 15, tension: -15, res: -5, feedback: 'Tuyệt vời! Hiệp thương dân chủ giúp hài hòa lợi ích (dù tốn thời gian).' },
      { text: 'Kêu gọi công nhân nhẫn nhịn vì lòng yêu nước thuần túy', trust: 5, tension: 0, res: 0, feedback: 'Không hiệu quả lâu dài vì chưa giải quyết được lợi ích vật chất.' }
    ]
  },
  {
    id: 'q4_danvan',
    title: 'Dân vận khéo (Chiến dịch Điện Biên Phủ)',
    context: 'Tiền tuyến cần lượng khổng lồ lương thực, nhưng đường đèo hiểm trở. Nguồn lực vận tải quân đội đã chạm giới hạn.',
    options: [
      { text: 'Ban hành quân lệnh ép buộc dân đinh đi dân công hỏa tuyến', trust: -20, tension: 25, res: 0, feedback: 'Mệnh lệnh hành chính làm suy giảm ý chí của nhân dân.' },
      { text: 'Cử cán bộ đi từng bản làng giải thích, vận động tự nguyện', trust: 18, tension: -10, res: -10, feedback: 'Đúng tư tưởng "Dân là gốc". Vận động tốn công sức nhưng tạo nên kỳ tích.' },
      { text: 'Dừng chiến dịch vì không đủ hậu cần', trust: -15, tension: -10, res: 20, feedback: 'Thiếu ý chí quyết chiến và không tin tưởng vào sức mạnh quần chúng.' }
    ]
  },
  {
    id: 'q5_hinhthuc',
    title: 'Linh hoạt Mặt trận (Tập hợp lực lượng)',
    context: 'Chuẩn bị kháng chiến toàn quốc. Mặt trận Việt Minh hiện tại cần đổi mới để thu hút thêm tầng lớp thượng lưu, tôn giáo.',
    options: [
      { text: 'Giữ nguyên Việt Minh để bảo vệ sự thuần khiết giai cấp', trust: -10, tension: 10, res: 0, feedback: 'Bệnh hẹp hòi! Không linh hoạt sẽ bỏ sót nhiều lực lượng yêu nước.' },
      { text: 'Thành lập Mặt trận Liên Việt với cơ cấu rộng rãi hơn', trust: 15, tension: -5, res: -5, feedback: 'Chính xác! Hình thức tổ chức Mặt trận phải đa dạng theo yêu cầu lịch sử.' },
      { text: 'Giải tán Việt Minh, thành lập một tổ chức hoàn toàn mới', trust: -15, tension: 15, res: -10, feedback: 'Sai lầm, điều này làm đánh mất nòng cốt vững chắc của khối liên minh.' }
    ]
  },
  {
    id: 'q6_quocte',
    title: 'Đoàn kết Quốc tế (Sức mạnh thời đại)',
    context: 'Địch tuyên truyền bôi nhọ cuộc kháng chiến của ta là "cực đoan" trên trường quốc tế. Nguồn lực ta đang cạn.',
    options: [
      { text: 'Đóng cửa biên giới, cắt đứt ngoại giao, tự lực cánh sinh', trust: -15, tension: 20, res: -20, feedback: 'Sai lầm! Tự cô lập sẽ làm cạn kiệt nguồn lực.' },
      { text: 'Tập trung chỉ nhờ vả viện trợ quân sự từ các nước lớn', trust: -5, tension: 10, res: 15, feedback: 'Dễ rơi vào thế bị động, mất đi tính độc lập tự chủ.' },
      { text: 'Đẩy mạnh ngoại giao nhân dân, tranh thủ sự ủng hộ quốc tế', trust: 15, tension: -10, res: 10, feedback: 'Hoàn hảo! Kết hợp sức mạnh dân tộc và thời đại là sách lược đúng đắn.' },
      { text: 'Nhượng bộ chính trị để đổi lấy sự công nhận quốc tế', trust: -25, tension: -15, res: 20, feedback: 'Vi phạm nguyên tắc tối cao: Độc lập Tổ quốc không thể thương lượng.' }
    ]
  },
  {
    id: 'q7_nambo',
    title: 'Kháng chiến Nam Bộ (Đoàn kết Bắc Nam)',
    context: 'Thực dân Pháp nổ súng đánh chiếm Nam Bộ. Miền Bắc vừa giành chính quyền đang đối mặt với thù trong giặc ngoài.',
    options: [
      { text: 'Phát động phong trào "Nam tiến", chi viện tối đa cho miền Nam', trust: 15, tension: -5, res: -15, feedback: 'Đúng tinh thần "Nước Việt Nam là một, dân tộc Việt Nam là một".' },
      { text: 'Tạm thời để Nam Bộ tự phòng thủ, tập trung giữ vững miền Bắc', trust: -25, tension: 20, res: 10, feedback: 'Sai lầm chiến lược! Chia rẽ Bắc Nam là đúng ý đồ của giặc.' },
      { text: 'Kêu gọi quốc tế can thiệp nhưng không cử quân đội vào Nam', trust: -10, tension: 5, res: -5, feedback: 'Quá bị động và thiếu tinh thần đoàn kết máu thịt.' }
    ]
  },
  {
    id: 'q8_tuanlevang',
    title: 'Huy động nguồn lực (Tuần lễ Vàng)',
    context: 'Ngân khố quốc gia trống rỗng sau độc lập. Chính phủ cần tiền để mua vũ khí và hoạt động.',
    options: [
      { text: 'In thêm tiền giấy ồ ạt để trang trải', trust: -15, tension: 20, res: 10, feedback: 'Gây lạm phát phi mã, đời sống nhân dân thêm khốn đốn.' },
      { text: 'Vay mượn lãi suất cao từ các tài phiệt ngoại quốc', trust: -10, tension: 10, res: 15, feedback: 'Đánh mất quyền tự chủ kinh tế của quốc gia non trẻ.' },
      { text: 'Tịch thu tài sản của các thương nhân lớn', trust: -25, tension: 25, res: 20, feedback: 'Hành động phá hoại nghiêm trọng khối đại đoàn kết.' },
      { text: 'Phát động "Tuần lễ Vàng", khơi dậy lòng yêu nước tự nguyện', trust: 15, tension: -5, res: 25, feedback: 'Dân vận xuất sắc! Nhân dân tự nguyện đóng góp hàng tạ vàng.' }
    ]
  },
  {
    id: 'q9_caicach',
    title: 'Sửa sai (Cải cách ruộng đất)',
    context: 'Trong cải cách ruộng đất đã xảy ra một số sai lầm nghiêm trọng (đấu tố sai), làm rạn nứt lòng tin ở nông thôn.',
    options: [
      { text: 'Che giấu sai lầm để bảo vệ uy tín của chính quyền', trust: -20, tension: 20, res: 0, feedback: 'Sự bao che sẽ làm nhân dân mất niềm tin hoàn toàn.' },
      { text: 'Công khai tự phê bình, xin lỗi nhân dân và đền bù', trust: 15, tension: -15, res: -15, feedback: 'Dũng cảm nhận lỗi là nguyên tắc tự phê bình thân ái, phục hồi lòng dân.' },
      { text: 'Đổ lỗi cho hoàn cảnh chiến tranh và cấp dưới', trust: -15, tension: 15, res: 0, feedback: 'Thiếu trách nhiệm, gây bức xúc lớn trong quần chúng.' },
      { text: 'Xóa bỏ hoàn toàn chính sách chia ruộng đất', trust: -10, tension: 15, res: -10, feedback: 'Dao động cực đoan. Nông dân vẫn cần ruộng đất để cày cấy.' }
    ]
  },
  {
    id: 'q10_mattranMN',
    title: 'Đa dạng thành phần (Mặt trận miền Nam)',
    context: 'Để mở rộng đấu tranh ở miền Nam, cần thành lập Mặt trận. Có ý kiến chỉ nên cho phép lực lượng bần nông tham gia.',
    options: [
      { text: 'Đồng ý, giữ tính giai cấp triệt để', trust: -15, tension: 15, res: -5, feedback: 'Tư tưởng tả khuynh, hẹp hòi. Đẩy các lực lượng khác về phía địch.' },
      { text: 'Mở rộng quy tụ trí thức, tôn giáo, tư sản dân tộc', trust: 15, tension: -10, res: 10, feedback: 'Tầm nhìn chiến lược! Đã quy tụ được sức mạnh tổng hợp to lớn.' },
      { text: 'Chỉ thu nạp những người đã từng tham gia kháng chiến', trust: -10, tension: 10, res: 0, feedback: 'Bỏ sót lớp thanh niên và những người mới giác ngộ yêu nước.' }
    ]
  },
  {
    id: 'q11_ton_giao',
    title: 'Khoan dung Tôn giáo',
    context: 'Lợi dụng tình hình, giặc tung tin đồn "Cách mạng vô thần sẽ cấm đạo" để lôi kéo đồng bào Công giáo di cư.',
    options: [
      { text: 'Ra lệnh cấm tụ tập ở các nhà thờ để ngăn chặn', trust: -20, tension: 25, res: -5, feedback: 'Mắc mưu giặc! Càng cấm đoán, đồng bào càng tin vào tin đồn.' },
      { text: 'Ban hành chính sách Tự do Tín ngưỡng, cử cán bộ vận động', trust: 15, tension: -15, res: -5, feedback: 'Khoan dung, tôn trọng đức tin là cách đập tan luận điệu chia rẽ.' },
      { text: 'Bỏ mặc, ai đi thì đi, ai ở thì ở', trust: -10, tension: 10, res: -10, feedback: 'Thiếu trách nhiệm, để tuột mất một lực lượng quần chúng lớn.' },
      { text: 'Dùng quân đội lập chốt chặn, bắt giữ người di cư', trust: -25, tension: 30, res: -10, feedback: 'Hành động bạo lực sẽ tạo ra hố sâu ngăn cách không thể hàn gắn.' }
    ]
  },
  {
    id: 'q12_vietkieu',
    title: 'Quy tụ Trí thức (Việt kiều)',
    context: 'Đất nước thiếu chuyên gia. Nhiều trí thức Việt kiều ở nước ngoài muốn về nước nhưng e ngại điều kiện khó khăn.',
    options: [
      { text: 'Phát thư kêu gọi, dùng tình cảm quê hương để thuyết phục', trust: 15, tension: -5, res: 15, feedback: 'Tuyệt vời! Rất nhiều trí thức lớn đã từ bỏ vinh hoa về nước (Brain gain).' },
      { text: 'Hứa hẹn trả lương thật cao, cấp nhà lầu xe hơi', trust: -5, tension: 10, res: -20, feedback: 'Nguồn lực quốc gia không cho phép, dễ gây bất mãn trong nước.' },
      { text: 'Gây sức ép lên gia đình họ ở trong nước để buộc họ về', trust: -25, tension: 25, res: 0, feedback: 'Thủ đoạn tồi tệ, hoàn toàn trái ngược với tư tưởng Hồ Chí Minh.' }
    ]
  },
  {
    id: 'q13_chinhhuan',
    title: 'Chỉnh đốn hàng ngũ',
    context: 'Một số cán bộ có thái độ hách dịch, coi thường quần chúng, tự cho mình quyền đứng trên nhân dân.',
    options: [
      { text: 'Cách chức ngay lập tức toàn bộ cán bộ vi phạm', trust: -5, tension: 20, res: -10, feedback: 'Quá nóng vội, làm tê liệt hệ thống quản lý cơ sở.' },
      { text: 'Nhắm mắt làm ngơ vì sợ mất đoàn kết nội bộ', trust: -15, tension: 15, res: 0, feedback: 'Bao che sai trái sẽ làm mục ruỗng khối đại đoàn kết từ bên trong.' },
      { text: 'Mở lớp chỉnh huấn, phê bình và tự phê bình thân ái', trust: 15, tension: -15, res: -5, feedback: 'Chính xác! Gột rửa tư tưởng sai lệch bằng giáo dục là phương thức hiệu quả.' }
    ]
  },
  {
    id: 'q14_loikeugoi',
    title: 'Phát động toàn dân',
    context: 'Pháp gửi tối hậu thư đòi tước vũ khí. Chiến tranh là không thể tránh khỏi. Cần một lời kêu gọi toàn quốc.',
    options: [
      { text: 'Chỉ kêu gọi quân đội và dân quân du kích chuẩn bị chiến đấu', trust: 5, tension: 10, res: -5, feedback: 'Chưa đủ! Bỏ qua sức mạnh to lớn của các tầng lớp nhân dân khác.' },
      { text: 'Kêu gọi "Bất kỳ đàn ông, đàn bà, người già, người trẻ..."', trust: 18, tension: -5, res: 15, feedback: 'Hào hùng! Lời kêu gọi quy tụ 100% sức mạnh khối đại đoàn kết.' },
      { text: 'Kêu gọi người có súng chiến đấu, người tay không đi tản cư', trust: -10, tension: 0, res: -10, feedback: 'Làm suy giảm thế trận chiến tranh nhân dân toàn dân toàn diện.' }
    ]
  },
  {
    id: 'q15_ngoaigiao',
    title: 'Ngoại giao khéo léo',
    context: 'Đang có bất đồng giữa các nước đồng minh (Liên Xô - Trung Quốc). Việt Nam cần viện trợ từ cả hai.',
    options: [
      { text: 'Chọn phe, ủng hộ một bên để nhận viện trợ tối đa', trust: -10, tension: 15, res: 10, feedback: 'Sai lầm! Đánh mất tính độc lập tự chủ và tự thu hẹp nguồn viện trợ.' },
      { text: 'Đứng giữa làm cầu nối, giữ thái độ độc lập, đoàn kết', trust: 15, tension: -15, res: 20, feedback: 'Ngoại giao xuất sắc! Nguyên tắc tự chủ giúp giữ vững tình đoàn kết quốc tế.' },
      { text: 'Từ chối viện trợ của cả hai để chứng minh sự trung lập', trust: 5, tension: 10, res: -25, feedback: 'Cực đoan. Đánh mất nguồn sức mạnh thời đại thiết yếu cho kháng chiến.' },
      { text: 'Chỉ nhận viện trợ bí mật, không công khai ủng hộ ai', trust: -5, tension: 15, res: 5, feedback: 'Thiếu quang minh chính đại, dễ gây nghi ngờ cho cả hai phe.' }
    ]
  }
];

// Hàm xáo trộn ngẫu nhiên
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const CinematicGame = () => {
  const [gameState, setGameState] = useState('hero'); 
  
  // Đã cập nhật Nguồn Lực khởi điểm về mức 50%
  const [stats, setStats] = useState({ trust: 40, tension: 45, resources: 50 });
  
  const [logs, setLogs] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [lastFeedback, setLastFeedback] = useState('');
  
  const MAX_TURNS = 12;

  const prepareGame = () => {
    // Reset state với resources: 50
    setStats({ trust: 40, tension: 45, resources: 50 });
    setLogs([]);
    setTurnCount(0);
    const shuffled = shuffleArray(QUESTION_POOL);
    setAvailableQuestions(shuffled);
    setGameState('intro');
  };

  const startPlaying = () => {
    nextTurn(availableQuestions, 0);
  };

  const nextTurn = (remainingQs, currentTurn) => {
    // Check điều kiện GAME OVER sớm
    if (currentTurn >= MAX_TURNS || remainingQs.length === 0 || stats.resources < 10 || stats.tension >= 80) {
      setGameState('booking');
    } else {
      const nextQ = remainingQs[0];
      setAvailableQuestions(remainingQs.slice(1));
      
      const nextQShuffledOptions = {
        ...nextQ,
        options: shuffleArray(nextQ.options)
      };
      
      setCurrentQuestion(nextQShuffledOptions);
      setGameState('playing');
    }
  };

  const updateStats = (t, ten, res, message) => {
    setStats(prev => ({
      trust: Math.min(100, Math.max(0, prev.trust + t)),
      tension: Math.min(100, Math.max(0, prev.tension + ten)),
      resources: Math.min(100, Math.max(0, prev.resources + res))
    }));
    setLogs(prev => [message, ...prev].slice(0, 3));
  };

  const handleChoice = (option) => {
    updateStats(option.trust, option.tension, option.res, option.feedback);
    setLastFeedback(option.feedback);
    setGameState('feedback');
  };

  const proceedToNext = () => {
    const nextTurnCount = turnCount + 1;
    setTurnCount(nextTurnCount);
    nextTurn(availableQuestions, nextTurnCount);
  };

  // Logic Đánh giá Kết quả
  let finalStatus = "";
  let finalDesc = "";
  
  if (stats.tension >= 80) {
    finalStatus = "Khủng Hoảng Mâu Thuẫn";
    finalDesc = "Thất bại! Sự cứng nhắc và hẹp hòi đã đẩy căng thẳng xã hội lên đỉnh điểm. Khối liên minh vỡ lở trước khi chiến dịch kết thúc.";
  } else if (stats.resources < 10) {
    finalStatus = "Suy Kiệt Nguồn Lực";
    finalDesc = "Thất bại! Đồng chí đã quản lý nguồn lực sai lầm, quốc gia không còn đủ tài nguyên để đi tới chặng đường cuối cùng.";
  } else if (stats.trust >= 80 && stats.tension < 40) {
    finalStatus = "Đại Đoàn Kết Thành Công";
    finalDesc = "Xuất sắc! Trải qua chiến dịch trường kỳ, đồng chí đã vận dụng hoàn hảo tư tưởng Hồ Chí Minh: Khoan dung, Hiệp thương và Dân vận khéo.";
  } else {
    finalStatus = "Đồng Thuận Tạm Thời";
    finalDesc = "Khối liên minh đã đi đến cuối con đường nhưng vẫn còn nhiều rạn nứt. Cần nỗ lực Dân vận khéo léo hơn nữa trong thời bình.";
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F3E8D6] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      
      <style>{`
        @keyframes particle {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-20vh) translateX(50px); opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.1); }
          50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.3); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .cinematic-bg {
          background: radial-gradient(circle at 50% 50%, #15120e 0%, #050505 80%);
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .text-gradient {
          background: linear-gradient(135deg, #FFF 0%, #D4AF37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* --- 3D AMBIENCE & PARTICLES --- */}
      <div className="fixed inset-0 pointer-events-none z-0 cinematic-bg">
        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#D4AF37] opacity-[0.04] blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-linear-to-t from-[#050505] to-transparent opacity-90"></div>
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"
            style={{
              left: `${Math.random() * 100}vw`,
              animation: `particle ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`,
              opacity: Math.random() * 0.6
            }}
          />
        ))}
      </div>

      {/* --- HUD: STATUS BARS --- */}
      {gameState !== 'hero' && gameState !== 'intro' && gameState !== 'rules' && (
        <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center transition-all duration-700 ease-in-out glass-panel border-b-0">
          <div className="flex gap-12 max-w-6xl mx-auto w-full px-4">
            <StatBar label="Đồng Thuận" value={stats.trust} color="bg-[#D4AF37]" />
            <StatBar label="Căng Thẳng" value={stats.tension} color="bg-red-700" />
            <StatBar label="Nguồn Lực" value={stats.resources} color="bg-[#A8B2C1]" />
          </div>
        </div>
      )}

      {/* --- CONTENT SECTIONS --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-screen flex flex-col justify-center">

        {/* 1. HERO SECTION */}
        {gameState === 'hero' && (
          <div className="flex flex-col items-center justify-center text-center animate-fade-in-up duration-1000 mt-10">
            <h3 className="text-xl uppercase tracking-[0.4em] text-[#D4AF37] mb-6">Tư Tưởng Hồ Chí Minh</h3>
            <h1 className="text-7xl md:text-8xl font-light tracking-tight mb-16 text-gradient">
              Mặt Trận Đồng Tâm
            </h1>
            
            <div className="relative w-56 h-56 mb-20 flex items-center justify-center">
               <div className="absolute inset-0 border-[0.5px] border-[#D4AF37]/30 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
               <div className="absolute inset-4 border border-[#D4AF37]/20 rounded-full border-dashed" style={{ animation: 'spin-slow 20s linear infinite' }}></div>
               <div className="absolute inset-8 border border-[#D4AF37]/40 rounded-full border-dotted" style={{ animation: 'spin-reverse 15s linear infinite' }}></div>
               <div className="absolute inset-14 border border-[#D4AF37]/60 rounded-full" style={{ animation: 'spin-slow 10s linear infinite' }}></div>
               <div className="w-12 h-12 bg-linear-to-tr from-[#D4AF37] to-[#F3E8D6] rounded-full shadow-[0_0_50px_#D4AF37] animate-pulse"></div>
            </div>

            <button 
              onClick={prepareGame}
              className="px-14 py-5 glass-panel rounded-full text-lg uppercase tracking-[0.3em] hover:bg-[#D4AF37]/10 border-[#D4AF37]/30 transition-all duration-500 text-[#D4AF37]"
              style={{ animation: 'glow 3s infinite' }}
            >
              Mở khóa Sa Bàn
            </button>
          </div>
        )}

        {/* 2. INTRO SECTION */}
        {gameState === 'intro' && (
          <div className="max-w-4xl mx-auto animate-fade-in-up text-center">
            <span className="text-[#D4AF37] text-sm tracking-[0.3em] block mb-4 uppercase">Lời Mở Đầu</span>
            <h2 className="text-5xl font-light mb-8">Trung Tâm Chỉ Huy Chiến Lược</h2>
            <p className="text-white/70 leading-loose font-light mb-12 text-2xl text-justify">
              Đồng chí đang có mặt tại Sa bàn chiến lược. Trước mắt đồng chí là {MAX_TURNS} bài toán thực tiễn mang tính lịch sử về công tác <b>"Đại Đoàn Kết Toàn Dân Tộc"</b>. 
              Hãy áp dụng đúng các nguyên tắc cốt lõi: <i>Khoan dung, Hiệp thương dân chủ, và Dân vận khéo</i> để quy tụ sức mạnh toàn dân.
            </p>
            <div className="flex gap-6 justify-center mt-4">
              <button 
                onClick={() => setGameState('rules')}
                className="px-10 py-4 glass-panel rounded-full text-lg uppercase tracking-[0.2em] hover:bg-white/10 border-white/20 transition-all duration-300 text-white"
              >
                Đọc Luật Chơi
              </button>
              <button 
                onClick={startPlaying}
                className="px-10 py-4 glass-panel rounded-full text-lg uppercase tracking-[0.2em] hover:bg-[#D4AF37]/10 border-[#D4AF37]/40 transition-all duration-300 text-[#D4AF37]"
              >
                Bỏ qua & Bắt đầu &rarr;
              </button>
            </div>
          </div>
        )}

        {/* 2.5 RULES SECTION */}
        {gameState === 'rules' && (
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl font-light mb-10 text-center text-gradient uppercase tracking-widest">Cẩm Nang Chiến Lược</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-[#D4AF37]">
                <div className="text-4xl mb-4">💛</div>
                <h3 className="text-2xl font-light mb-3 text-white">Đồng Thuận</h3>
                <p className="text-white/60 text-lg leading-relaxed text-justify">
                  Khởi điểm 40%. Là sự ủng hộ của nhân dân. Mọi quyết sách khoan dung, thấu tình đạt lý sẽ làm tăng chỉ số này. Cần đạt <b>≥ 80%</b> để chiến thắng hoàn hảo.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-red-600">
                <div className="text-4xl mb-4">🔴</div>
                <h3 className="text-2xl font-light mb-3 text-white">Căng Thẳng</h3>
                <p className="text-white/60 text-lg leading-relaxed text-justify">
                  Khởi điểm 45%. Là mâu thuẫn xã hội. Những quyết định áp đặt, độc đoán sẽ đẩy Căng thẳng lên cao. Nếu chạm mốc <b>80%</b>, khối liên minh vỡ lở ➔ <b>Thất bại</b>.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-blue-400">
                <div className="text-4xl mb-4">🔵</div>
                <h3 className="text-2xl font-light mb-3 text-white">Nguồn Lực</h3>
                <p className="text-white/60 text-lg leading-relaxed text-justify">
                  Khởi điểm 50%. "Dân vận khéo" và nhượng bộ lợi ích thường làm tiêu hao nguồn lực. Nếu ngân khố tụt xuống dưới <b>10%</b>, chiến dịch phá sản ➔ <b>Thất bại</b>.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={startPlaying}
                className="px-14 py-5 bg-[#D4AF37]/10 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/20 rounded-full transition uppercase tracking-[0.3em] text-xl text-[#D4AF37]"
                style={{ animation: 'glow 3s infinite' }}
              >
                Đã Rõ Mật Lệnh - Bắt Đầu &rarr;
              </button>
            </div>
          </div>
        )}

        {/* 3. PLAYING SECTION */}
        {gameState === 'playing' && currentQuestion && (
          <div className="w-full max-w-6xl mx-auto animate-fade-in-up mt-16">
             <div className="flex justify-between items-center mb-8">
                <span className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">
                  Mật lệnh {turnCount + 1}/{MAX_TURNS}
                </span>
                <span className="text-white/30 text-sm tracking-[0.3em] uppercase">Mã hồ sơ: {currentQuestion.id}</span>
             </div>
             
             <h2 className="text-4xl md:text-5xl font-light mb-6 text-gradient leading-tight">{currentQuestion.title}</h2>
             <p className="text-white/80 leading-relaxed font-light mb-12 text-2xl">
               {currentQuestion.context}
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQuestion.options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleChoice(opt)}
                    className="group text-left glass-panel p-8 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-all duration-300 relative overflow-hidden flex items-center min-h-35"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10 text-xl font-light text-white/90 group-hover:text-[#D4AF37] transition-colors leading-relaxed">
                      {opt.text}
                    </div>
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* 4. FEEDBACK SECTION */}
        {gameState === 'feedback' && (
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up mt-10">
            <h2 className="text-3xl font-light mb-8 text-[#D4AF37] uppercase tracking-widest">Báo Cáo Hệ Quả</h2>
            <div className="p-12 glass-panel rounded-3xl mb-12 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <p className="text-3xl font-light text-white/95 leading-relaxed">
                "{lastFeedback}"
              </p>
            </div>
            <button 
              onClick={proceedToNext}
              className="px-12 py-5 bg-white/5 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-full transition uppercase tracking-[0.2em] text-lg"
            >
              {turnCount < MAX_TURNS ? "Tiếp nhận tình huống mới \u2192" : "Xem Tổng Kết Chiến Dịch \u2192"}
            </button>
          </div>
        )}

        {/* 5. END SECTION */}
        {gameState === 'booking' && (
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up mt-10">
            <span className="text-[#D4AF37] text-sm tracking-[0.3em] block mb-4 uppercase">Tổng Kết Chiến Dịch</span>
            <h2 className={`text-6xl font-light mb-12 ${finalStatus === 'Đại Đoàn Kết Thành Công' ? 'text-[#D4AF37]' : 'text-red-500'}`}>
              {finalStatus}
            </h2>
            <div className="p-12 glass-panel rounded-3xl mb-12">
              <div className="flex justify-center gap-16 mb-10 border-b border-white/10 pb-10">
                 <div>
                   <div className="text-5xl text-[#D4AF37] mb-3">{stats.trust}%</div>
                   <div className="text-sm uppercase tracking-[0.3em] text-white/60">Đồng Thuận</div>
                 </div>
                 <div>
                   <div className="text-5xl text-red-500 mb-3">{stats.tension}%</div>
                   <div className="text-sm uppercase tracking-[0.3em] text-white/60">Căng Thẳng</div>
                 </div>
                 <div>
                   <div className="text-5xl text-blue-400 mb-3">{stats.resources}%</div>
                   <div className="text-sm uppercase tracking-[0.3em] text-white/60">Nguồn Lực</div>
                 </div>
              </div>
              <p className="text-white/80 font-light text-2xl leading-relaxed">
                {finalDesc}
              </p>
            </div>
            <button 
              onClick={prepareGame}
              className="px-12 py-5 glass-panel hover:bg-white/10 rounded-full transition uppercase tracking-[0.3em] text-lg text-[#D4AF37] border-[#D4AF37]/40"
            >
              Thiết lập lại Sa Bàn
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const StatBar = ({ label, value, color }) => (
  <div className="flex-1">
    <div className="flex justify-between text-xs uppercase tracking-[0.3em] text-white/60 mb-3">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
      <div className={`absolute top-0 left-0 h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default CinematicGame;