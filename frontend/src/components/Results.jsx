import React, { useState } from "react";
import {
  Image as ImageIcon,
  ArrowLeft,
  Loader2,
  ChevronDown,
  Globe, // 新增：用于语言选择
} from "lucide-react";

// --- 简单的 UI 文本翻译映射 ---
const uiTexts = {
  zh: {
    title: "菜单识别结果",
    appetizer: "开胃菜",
    mainCourse: "主菜",
    newRestaurant: "新餐厅",
    save: "保存",
    viewImage: "查看原图", // 新增翻译项
    noMenuItems: "未识别到菜单项"
  },
  en: {
    title: "Menu Results",
    appetizer: "Appetizer",
    mainCourse: "Main Course",
    newRestaurant: "New Restaurant",
    save: "Save",
    viewImage: "View full image", // 新增翻译项
    noMenuItems: "No menu items found"
  },
  es: {
    title: "Resultados del Menú",
    appetizer: "Aperitivo",
    mainCourse: "Plato Principal",
    newRestaurant: "Nuevo Restaurante",
    save: "Guardar",
    viewImage: "Ver imagen completa", // 新增翻译项
    noMenuItems: "No se encontraron elementos del menú"
  }
};

const langOptions = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
];

/**
 * 单个菜单项卡片组件
 * @param {object} item - 菜单项数据
 * @param {string} currentLang - 当前语言代码
 */
const MenuItemCard = ({ item, currentLang }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useThumbnail, setUseThumbnail] = useState(false);

  // 如果后端返回了 translations，读取对应语言，否则回退到原始 dish 名称
  const displayName = item.translations?.[currentLang] || item.dish;

  const mainUrl = item.image?.url || item.image?.link || null;
  const thumbnailUrl = item.image?.thumbnailLink || null;
  const currentImageUrl = useThumbnail ? thumbnailUrl : mainUrl;
  const hasAnyImage = mainUrl || thumbnailUrl;
  
  const handleImageError = () => {
    if (!useThumbnail && thumbnailUrl) {
      setUseThumbnail(true);
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  };
  
  // 获取 "查看原图" 的翻译
  const t = uiTexts[currentLang];

  return (
    <div className="flex flex-col">
      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative">
        {currentImageUrl && !imageError ? (
          <>
            <img
              src={currentImageUrl}
              // 使用翻译后的名称作为 alt 属性
              alt={displayName} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              referrerPolicy="no-referrer"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-black/30" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/30">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm leading-tight font-semibold">
            {displayName}
        </h3>
        {item.description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-tight">{item.description}</p>
        )}
        {item.price && (
          <p className="text-xs text-gray-500 mt-0.5">{item.price}</p>
        )}
        
        {/* --- 新增：查看详细图链接 --- */}
        {mainUrl && (
          <a
            href={mainUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-1 inline-block"
          >
            {t.viewImage}
          </a>
        )}
        
      </div>
    </div>
  );
};

export default function Results({ 
  results, 
  onScanAnother, 
  onNewScan 
}) {
  // --- 状态：当前语言 (zh: 中文, en: 英文, es: 西班牙语) ---
  const [currentLang, setCurrentLang] = useState("zh");
  if (!results) return null;

  // 获取当前语言的翻译文本
  const t = uiTexts[currentLang];
  
  const menuItems = results.menu_with_images || [];
  const appetizers = menuItems.slice(0, 2);
  const mainCourse = menuItems.slice(2);
  
  // 查找当前语言的全名
  const currentLangName = langOptions.find(opt => opt.code === currentLang)?.name || currentLang.toUpperCase();
  
  const handleLangChange = (langCode) => {
      setCurrentLang(langCode);
  };

  return (
    <div className="mx-auto max-w-sm bg-[#ffffff] min-h-screen flex flex-col">
      <div className="flex-1 px-4 pt-6 pb-24">
        

        {/* 顶部导航栏，包含语言选择 */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black/20">
          <div className="flex items-center gap-2">
            <button
              onClick={onScanAnother}
              className="p-1"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg">{t.newRestaurant}</h1>
          </div>
          <div className="flex items-center gap-2">
            
            {/* 语言选择下拉菜单 (结合了您的 select 元素想法) */}
            <div className="relative flex items-center gap-1 text-sm px-3 py-0.2 rounded-full border border-black/20 bg-white">
                <Globe className="w-4 h-4 text-black/50" />
                <select 
                    value={currentLang}
                    onChange={(e) => handleLangChange(e.target.value)}
                    className="bg-transparent text-sm font-semibold focus:outline-none appearance-none pr-1 cursor-pointer"
                >
                    {langOptions.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.code.toUpperCase()}
                        </option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 ml-[-8px] pointer-events-none" />
            </div>
            
            <button className="flex items-center gap-1 text-sm px-3 py-0.2 rounded-full border border-black/20 bg-white">
              {t.save}
            </button>
          </div>
        </div>

        {/* 开胃菜部分 */}
        {appetizers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3">{t.appetizer}</h2>
            <div className="grid grid-cols-2 gap-4">
              {appetizers.map((item, index) => (
                <MenuItemCard key={index} item={item} currentLang={currentLang} />
              ))}
            </div>
          </div>
        )}

        {/* 主菜部分 */}
        {mainCourse.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3">{t.mainCourse}</h2>
            <div className="grid grid-cols-2 gap-4">
              {mainCourse.map((item, index) => (
                <MenuItemCard key={index} item={item} currentLang={currentLang} />
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {menuItems.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            {t.noMenuItems}
          </div>
        )}
      </div>
      
    </div>
  );
}