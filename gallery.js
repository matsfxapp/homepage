const archiveData = {
    months: {
        'november-2024': {
            title: 'November 2024',
            days: {
                '11': {
                    title: '11th November 2024',
                    files: [
                        '/collage/Bild16.png',
                        '/collage/Bild17.png',
                        '/collage/Bild18.png',
                        '/collage/Bild19.png'
                    ]
                }
            }
        },
        'october-2024': {
            title: 'October 2024',
            days: {
                '10': {
                    title: '10th October 2024',
                    files: [
                        '/collage/Bild15.png',
                        '/collage/Bild14.png',
                        '/collage/Bild13.png'
                    ]
                },
                '5': {
                    title: '5th October 2024',
                    files: []
                },
                '4': {
                    title: '4th October 2024',
                    files: [
                        '/collage/Bild10.png',
                        '/collage/Bild11.png'
                    ]
                },
                '3': {
                    title: '3rd October 2024',
                    files: [
                        '/collage/Bild7.png',
                        '/collage/Bild8.png',
                        '/collage/Bild9.png'
                    ]
                },
                '2': {
                    title: '2nd October 2024',
                    files: [
                        '/collage/Bild6.png'
                    ]
                },
                '1': {
                    title: '1st October 2024',
                    files: [
                        '/collage/Bild1.png',
                        '/collage/Bild2.png',
                        '/collage/Bild3.png',
                        '/collage/Bild5.png'
                    ]
                }
            }
        }
    }
};

let currentPath = [];
let currentImages = [];
let currentImageIndex = 0;

function navigateHome() {
    currentPath = [];
    playClickSound();
    renderContent();
    updateBreadcrumb();
}

function openMonth(monthId) {
    currentPath = [{id: monthId, title: archiveData.months[monthId].title}];
    playClickSound();
    renderContent();
    updateBreadcrumb();
}

function openDay(dayId) {
    const month = archiveData.months[currentPath[0].id];
    currentPath.push({id: dayId, title: month.days[dayId].title});
    playClickSound();
    renderContent();
    updateBreadcrumb();
}

function navigateToPath(depth) {
    currentPath = currentPath.slice(0, depth);
    playClickSound();
    renderContent();
    updateBreadcrumb();
}

function renderContent() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    if (currentPath.length === 0) {
        renderMonths(content);
    } else if (currentPath.length === 1) {
        renderDays(content);
    } else if (currentPath.length === 2) {
        renderGallery(content);
    }
}

function renderMonths(container) {
    Object.entries(archiveData.months).forEach(([id, month]) => {
        const totalFiles = Object.values(month.days)
            .reduce((sum, day) => sum + day.files.length, 0);
        
        const monthElement = createFolderElement(
            month.title,
            `${totalFiles} Files`,
            () => openMonth(id)
        );
        container.appendChild(monthElement);
    });
}

function renderDays(container) {
    const month = archiveData.months[currentPath[0].id];
    Object.entries(month.days).forEach(([day, data]) => {
        const dayElement = createFolderElement(
            data.title,
            `${data.files.length} Files`,
            () => openDay(day)
        );
        container.appendChild(dayElement);
    });
}

function renderGallery(container) {
    const month = archiveData.months[currentPath[0].id];
    const day = month.days[currentPath[1].id];
    currentImages = day.files;

    if (day.files.length === 0) {
        container.innerHTML = `
            <div class="empty-folder">
                <h3>Nothing here yet</h3>
                <p>This folder is empty</p>
            </div>
        `;
        return;
    }

    day.files.forEach((file, index) => {
        const imageElement = createGalleryImage(file, index);
        container.appendChild(imageElement);
    });
}

function createFolderElement(title, subtitle, onClick) {
    const folder = document.createElement('div');
    folder.className = 'folder';
    folder.innerHTML = `
        <h2>${title}</h2>
        <div class="folder-info">
            <p>${subtitle}</p>
        </div>
    `;
    folder.addEventListener('click', onClick);
    return folder;
}

function createGalleryImage(src, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Image ${index + 1}`;
    img.addEventListener('click', () => openFullscreen(index));
    
    wrapper.appendChild(img);
    return wrapper;
}

function updateBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb');
    breadcrumb.innerHTML = `
        <span onclick="navigateHome()">Home</span>
        ${currentPath.map((path, index) => `
            <span>›</span>
            <span onclick="navigateToPath(${index + 1})">${path.title}</span>
        `).join('')}
    `;
}

function openFullscreen(index) {
    currentImageIndex = index;
    const container = document.getElementById('fullscreen-container');
    const img = document.getElementById('fullscreen-img');
    img.src = currentImages[currentImageIndex];
    container.style.display = 'flex';
    playClickSound();
}

function closeFullscreen() {
    const container = document.getElementById('fullscreen-container');
    container.style.display = 'none';
    playClickSound();
}

function nextImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    document.getElementById('fullscreen-img').src = currentImages[currentImageIndex];
    playClickSound();
}

function prevImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    document.getElementById('fullscreen-img').src = currentImages[currentImageIndex];
    playClickSound();
}

function playClickSound() {
    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {
        console.log('Sound playback was prevented');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    updateBreadcrumb();
});

document.addEventListener('keydown', (e) => {
    if (document.getElementById('fullscreen-container').style.display === 'flex') {
        switch(e.key) {
            case 'ArrowRight':
                nextImage(new Event('dummy'));
                break;
            case 'ArrowLeft':
                prevImage(new Event('dummy'));
                break;
            case 'Escape':
                closeFullscreen();
                break;
        }
    }
});
