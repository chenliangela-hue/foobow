// Foobow admin console — localization and demo data.
// The console reads live figures from the admin API when configured
// (Settings → API); otherwise it shows this clearly-labelled demo data.
// Money here is transparent donations + optional support, never
// "fortune unlocks" — Foobow never sells luck.
window.FOOBOW_ADMIN = {
  locales: ["zh", "en"],
  langNames: { zh: "中文", en: "English" },

  i18n: {
    zh: {
      htmlLang: "zh-Hans",
      brand: "Foobow 福报",
      brandSub: "管理后台",
      demoBadge: "演示数据",
      refresh: "刷新",
      nav: {
        dashboard: "数据看板",
        orders: "订单审核",
        users: "用户列表",
        pricing: "商品定价",
        audit: "审计日志",
        settings: "系统配置"
      },
      dashboard: {
        title: "数据看板",
        incomeToday: "今日支持",
        incomeTotal: "累计支持",
        incomeNote: "支持来自透明的捐助与自愿赞助，绝不购买好运。",
        usersGroup: "用户",
        usersTotal: "累计用户",
        usersActive: "今日活跃",
        usersHistory: "历史记录",
        usersNew: "今日新增",
        ordersGroup: "支持记录",
        ordersTotal: "累计记录",
        ordersPaid: "已完成",
        ordersPending: "待处理",
        ordersReview: "待审核"
      },
      orders: {
        title: "订单审核",
        colId: "编号",
        colItem: "项目",
        colAmount: "金额",
        colProvider: "渠道",
        colStatus: "状态",
        colAction: "操作",
        approve: "通过",
        reject: "驳回",
        empty: "没有待审核的记录。",
        approved: "已通过",
        rejected: "已驳回"
      },
      users: {
        title: "用户列表",
        colName: "用户",
        colLocale: "语言",
        colStreak: "连续天数",
        colKarma: "善缘",
        colJoined: "加入时间"
      },
      pricing: {
        title: "商品定价",
        colName: "名称",
        colKind: "类型",
        colPrice: "价格",
        colStatus: "状态",
        note: "价格用于自愿赞助与真实捐助，均清楚标示。"
      },
      audit: {
        title: "审计日志",
        colTime: "时间",
        colActor: "操作者",
        colAction: "动作",
        colTarget: "对象"
      },
      settings: {
        title: "系统配置",
        apiTitle: "API 连接",
        apiDesc: "填入管理 API 地址与管理令牌，即可读取真实数据。留空则显示演示数据。",
        apiUrl: "API 地址",
        apiToken: "管理令牌",
        save: "保存",
        saved: "已保存",
        securityTitle: "登录安全",
        securityDesc: "生产环境的管理登录使用后端管理账户与审计日志；此演示不收集任何真实凭据。"
      },
      status: {
        paid: "已完成",
        pending: "待处理",
        failed: "失败",
        refunded: "已退款",
        none: "—",
        review: "待审核",
        active: "启用",
        hidden: "隐藏",
        retired: "停用"
      },
      kinds: {
        donation: "捐助",
        premium_pack: "静修包",
        lamp_offering: "心灯供养",
        subscription: "订阅"
      }
    },
    en: {
      htmlLang: "en",
      brand: "Foobow 福报",
      brandSub: "Admin console",
      demoBadge: "Demo data",
      refresh: "Refresh",
      nav: {
        dashboard: "Dashboard",
        orders: "Order review",
        users: "Users",
        pricing: "Pricing",
        audit: "Audit log",
        settings: "Settings"
      },
      dashboard: {
        title: "Dashboard",
        incomeToday: "Support today",
        incomeTotal: "Support to date",
        incomeNote: "Support comes from transparent donations and voluntary tips — never from buying luck.",
        usersGroup: "Users",
        usersTotal: "Total users",
        usersActive: "Active today",
        usersHistory: "History records",
        usersNew: "New today",
        ordersGroup: "Support records",
        ordersTotal: "Total records",
        ordersPaid: "Completed",
        ordersPending: "Pending",
        ordersReview: "Awaiting review"
      },
      orders: {
        title: "Order review",
        colId: "ID",
        colItem: "Item",
        colAmount: "Amount",
        colProvider: "Channel",
        colStatus: "Status",
        colAction: "Action",
        approve: "Approve",
        reject: "Reject",
        empty: "No records awaiting review.",
        approved: "Approved",
        rejected: "Rejected"
      },
      users: {
        title: "Users",
        colName: "User",
        colLocale: "Locale",
        colStreak: "Streak",
        colKarma: "Karma",
        colJoined: "Joined"
      },
      pricing: {
        title: "Pricing",
        colName: "Name",
        colKind: "Kind",
        colPrice: "Price",
        colStatus: "Status",
        note: "Prices are for voluntary support and real donations, always clearly labelled."
      },
      audit: {
        title: "Audit log",
        colTime: "Time",
        colActor: "Actor",
        colAction: "Action",
        colTarget: "Target"
      },
      settings: {
        title: "Settings",
        apiTitle: "API connection",
        apiDesc: "Enter the admin API URL and an admin token to read live data. Leave blank to show demo data.",
        apiUrl: "API URL",
        apiToken: "Admin token",
        save: "Save",
        saved: "Saved",
        securityTitle: "Login security",
        securityDesc: "Production admin login uses backend admin accounts and an audit log; this demo collects no real credentials."
      },
      status: {
        paid: "Completed",
        pending: "Pending",
        failed: "Failed",
        refunded: "Refunded",
        none: "—",
        review: "Awaiting review",
        active: "Active",
        hidden: "Hidden",
        retired: "Retired"
      },
      kinds: {
        donation: "Donation",
        premium_pack: "Meditation pack",
        lamp_offering: "Lamp offering",
        subscription: "Subscription"
      }
    }
  },

  demo: {
    metrics: {
      currency: "¥",
      incomeToday: 317.4,
      incomeTotal: 979.8,
      usersTotal: 269,
      usersActive: 11,
      usersHistory: 124,
      usersNew: 5,
      ordersTotal: 81,
      ordersPaid: 70,
      ordersPending: 10,
      ordersReview: 2
    },
    orders: [
      { id: "ord_10241", item: "lamp_offering", amount: 9.0, provider: "wechatpay", status: "pending", review: "pending" },
      { id: "ord_10240", item: "donation", amount: 30.0, provider: "stripe", status: "pending", review: "pending" },
      { id: "ord_10239", item: "premium_pack", amount: 12.0, provider: "applepay", status: "paid", review: "none" },
      { id: "ord_10238", item: "donation", amount: 6.0, provider: "stripe", status: "paid", review: "none" },
      { id: "ord_10237", item: "subscription", amount: 3.0, provider: "googlepay", status: "paid", review: "none" }
    ],
    users: [
      { name: "quiet_lotus", locale: "zh-Hans", streak: 14, karma: 92, joined: "2026-05-02" },
      { name: "gentle_tide", locale: "en", streak: 7, karma: 68, joined: "2026-06-11" },
      { name: "still_water", locale: "ja", streak: 21, karma: 100, joined: "2026-04-18" },
      { name: "warm_lantern", locale: "th", streak: 3, karma: 24, joined: "2026-07-15" },
      { name: "kind_road", locale: "fr", streak: 9, karma: 54, joined: "2026-06-29" }
    ],
    catalog: [
      { name: "Operating support", kind: "donation", price: 6.0, status: "active" },
      { name: "Verified cause — shelter meals", kind: "donation", price: 30.0, status: "active" },
      { name: "Deep Calm soundscape pack", kind: "premium_pack", price: 12.0, status: "active" },
      { name: "Wish lamp offering", kind: "lamp_offering", price: 9.0, status: "active" },
      { name: "Ad-free year", kind: "subscription", price: 18.0, status: "hidden" }
    ],
    audit: [
      { time: "2026-07-23 14:22", actor: "owner", action: "order.approve", target: "ord_10236" },
      { time: "2026-07-23 13:58", actor: "reviewer", action: "catalog.update", target: "deep-calm-pack" },
      { time: "2026-07-23 11:04", actor: "owner", action: "user.suspend", target: "user_5521" },
      { time: "2026-07-22 19:40", actor: "reviewer", action: "order.reject", target: "ord_10230" }
    ]
  }
};
