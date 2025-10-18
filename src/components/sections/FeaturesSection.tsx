"use client"

import type React from "react"
import { motion } from "framer-motion"
import { HiTrendingUp, HiShieldCheck, HiLightBulb, HiUsers, HiChartBar, HiGlobe } from "react-icons/hi"
import Card from "../ui/Card"
import Heading from "../ui/Heading"
import Text from "../ui/Text"
import Icon from "../ui/Icon"
import Container from "../ui/Container"
import Grid from "../ui/Grid"

// const FeaturesSection: React.FC = () => {
  // const features = [
  //   {
  //     icon: HiTrendingUp,
  //     title: "Phân tích tài chính chuyên sâu",
  //     description: "Sử dụng công nghệ AI và machine learning để đánh giá rủi ro và cơ hội đầu tư một cách chính xác.",
  //     color: "blue"
  //   },
  //   {
  //     icon: HiShieldCheck,
  //     title: "Bảo mật tuyệt đối",
  //     description: "Hệ thống bảo mật đa lớp, đảm bảo thông tin khách hàng và dữ liệu đầu tư được bảo vệ tối đa.",
  //     color: "yellow"
  //   },
  //   {
  //     icon: HiLightBulb,
  //     title: "Sáng tạo không ngừng",
  //     description: "Luôn tìm kiếm và phát triển những giải pháp đầu tư mới, phù hợp với xu hướng thị trường.",
  //     color: "blue"
  //   },
  //   {
  //     icon: HiUsers,
  //     title: "Đội ngũ chuyên gia",
  //     description: "Hơn 50 chuyên gia giàu kinh nghiệm trong lĩnh vực tài chính và công nghệ.",
  //     color: "yellow"
  //   },
  //   {
  //     icon: HiChartBar,
  //     title: "Báo cáo chi tiết",
  //     description: "Cung cấp báo cáo phân tích chi tiết và dự báo xu hướng thị trường hàng quý.",
  //     color: "blue"
  //   },
  //   {
  //     icon: HiGlobe,
  //     title: "Toàn cầu hóa",
  //     description: "Mở rộng cơ hội đầu tư ra thị trường quốc tế với mạng lưới đối tác rộng khắp.",
  //     color: "yellow"
  //   }
  // ]

  // return (
    // <section className="py-20 bg-white">
    //   <Container>
    //     <motion.div
    //       initial={{ opacity: 0, y: 30 }}
    //       whileInView={{ opacity: 1, y: 0 }}
    //       viewport={{ once: true }}
    //       transition={{ duration: 0.8 }}
    //       className="text-center mb-16"
    //     >
    //       <Heading level={2} align="center" color="blue" className="mb-4">
//         Tại sao chọn Y&T Group?
    //       </Heading>
    //       <Text size="lg" color="muted" align="center" className="max-w-3xl mx-auto">
    //         Chúng tôi mang đến những giải pháp đầu tư thông minh, 
    //         được hỗ trợ bởi công nghệ tiên tiến và đội ngũ chuyên gia giàu kinh nghiệm.
    //       </Text>
    //     </motion.div>

    //     <Grid cols={3} gap="lg" animated>
    //       {features.map((feature, index) => (
    //         <motion.div
    //           key={index}
    //           initial={{ opacity: 0, y: 30 }}
    //           whileInView={{ opacity: 1, y: 0 }}
    //           viewport={{ once: true }}
    //           transition={{ duration: 0.6, delay: index * 0.1 }}
    //         >
    //           <Card variant="elevated" padding="lg" className="h-full text-center group">
    //             <div className="mb-6">
    //               <Icon
    //                 icon={feature.icon}
    //                 size="2xl"
    //                 color={feature.color as any}
    //                 animated
    //                 className="mx-auto group-hover:scale-110 transition-transform duration-300"
    //               />
    //             </div>
    //             <Heading level={4} align="center" className="mb-4">
    //               {feature.title}
    //             </Heading>
    //             <Text color="muted" align="center">
    //               {feature.description}
    //             </Text>
    //           </Card>
    //         </motion.div>
    //       ))}
    //     </Grid>
    //   </Container>
    // </section>
  // )
// }

// export default FeaturesSection

